const fs = require("fs");
const { contextBridge, ipcRenderer } = require( "electron");

contextBridge.exposeInMainWorld("electronApi", {
    runTests: (profilePath: string, apkPath: string) =>
      ipcRenderer.invoke("run-tests", profilePath, apkPath),
  

    openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),

    onProcessUpdate: (callback: (msg: any) => void) => {
      ipcRenderer.on("process-update", (_event: any, msg: any) => callback(msg));
    },
    
    readFile: (path: string) => {
      const content = fs.readFileSync(path, "utf8")
      return content;
    },

    getFilePaths: (): Promise<string[]> => {
      return new Promise((resolve) => {
        console.log("getFilePath: ")
        const input = document.createElement("input");
        input.type = "file";
        input.onchange = () => {
          const files = Array.from(input.files || []);
          files.forEach((f)=> {
            console.log(`📦 File Name: ${f.name}`);  
            console.log(`📦 File Path: ${f.path}`);  
          });
          // console.log("📦 File object(s):", files);
          resolve(files.map((file: any) => file.path));
        };
        input.click();
      });
    }
  });


