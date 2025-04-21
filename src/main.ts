import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from 'url';

const createWindow = () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename); // get the name of the directory
  console.log(`create window: ${__dirname}`);
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("renderer/index.html");
  win.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
});

ipcMain.handle("run-tests", async (_event, profilePath, apkPath) => {
  return new Promise((resolve) => {
    const runner = spawn("node", ["dist/appium/test_runner.js", profilePath, apkPath]);
    let output = "";

    runner.stdout.on("data", (data) => {
      output += data.toString();
    });

    runner.stderr.on("data", (data) => {
      output += "❌ " + data.toString();
    });

    runner.on("exit", () => {
      resolve(output);
    });
  });
});

ipcMain.handle("open-file-dialog", async () => {
  const result = await dialog.showOpenDialog({ properties: ["openFile"] });
  return result.filePaths;
});
