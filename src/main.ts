import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { spawn } from "child_process";
import path from "path";

const createWindow = () => {
  console.log(`create window: ${__dirname}`);
  let preloadPath = path.join(__dirname, "preload.js");
  console.log(`preloadPath: ${preloadPath}`);
  
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
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
