import { spawn, execSync, ChildProcessByStdio } from "child_process";
import * as fs from "fs";
import { Stream } from "node:stream";
import path from "path";


// ✅ Log file path
const currentDir = process.cwd();
const logFilePath = path.join(currentDir, "logcat_dump.txt");
let logStream = fs.createWriteStream(logFilePath, { flags: "w" });

// ✅ Start the ADB logcat process
let logcatProcess : ChildProcessByStdio<null, Stream.Readable, Stream.Readable>;

console.log(`🚀 Logcat collected at ${logFilePath}`);

// ✅ Write logcat output to file and console

// ✅ Handle process exit and cleanup




export const startLogcat = (packageName : String) => {
    const pid = execSync(`adb shell pidof -s ${packageName}`).toString().trim()

    logcatProcess = spawn("adb", ["logcat", `--pid`, pid], { stdio: ["ignore", "pipe", "pipe"] });
    logcatProcess.stdout.pipe(logStream)
    // logcatProcess.stdout.on("data", (data) => {
    //     console.log(`👉🏻 Logcat data: ${data.toString()}`);
    //     const log = data.toString();
    //     logStream.write(log);
    //   });
      
      logcatProcess.stderr.on("data", (data) => {
        console.error(`❌ Logcat Error: ${data}`);
      });
}

export const stopLogcat = () => {
  console.log("\n🛑 Stopping logcat...");
  logcatProcess.kill(); // Kill the logcat process
  logStream.end(); // Close the log file
  process.exit(0);
};

export const clearLogcat = () => {
  const buffer = Buffer.from("", "utf8")
  fs.truncateSync(logFilePath);
  fs.fdatasyncSync((logStream as any).fd); // force flush file metadata
  fs.writeSync((logStream as any).fd, buffer, 0, buffer.length, 0);
}

// ✅ Listen for CTRL+C to stop logging
process.on("SIGINT", stopLogcat);
process.on("SIGTERM", stopLogcat);
