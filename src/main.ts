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
  // win.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
});

ipcMain.handle("run-tests", async (_event, profilePath, apkPath) => {
  return new Promise((resolve) => {
    const runner = spawn("node", ["dist/appium/test_runner.js", profilePath, apkPath]);
    let output = "";
    let buffer = "";

    runner.stdout.on("data", (chunk) => {
      console.log("stdout: chunk: " + chunk)

      buffer += chunk.toString();

      let lines = chunk.toString().split("\\n");
      const message = buffer = lines.pop() || "";
      console.log("stdout: poped line: " + message)

      for (const line of lines) {
        try {
          const message = JSON.parse(line);
          //console.log("stdout: message: " + message)
          _event.sender.send("process-update", message);
        } catch {
          //console.warn("stdout: failed to parse line to object: " + line)
          _event.sender.send("process-update", line)
          //console.warn("❗Invalid JSON from child:", line);
        }
      }

      // console.log("stdHandler: " + data)
      // try{
      //   const message = JSON.parse(data);
      //   output += data;
      //   _event.sender.send("process-update", message);
      // } catch {
      //   _event.sender.send("process-update", data);
      // }
     // output += data.toString();
     
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
