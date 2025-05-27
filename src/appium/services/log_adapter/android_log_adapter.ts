import { startLogcat, stopLogcat, clearLogcat } from "../logcat";
import { DeviceLogAdapter } from "./log_adapter";
import * as fs from "fs";

export class AndroidLogAdapter implements DeviceLogAdapter{

    currentDir = process.cwd()
    
    startDeviceLogger(applicationId: string): Promise<void> {
        startLogcat(applicationId);
        return Promise.resolve();
    }

    stopDeviceLogger(): Promise<void> {        
        stopLogcat()
        return Promise.resolve()
    }

    clear(): Promise<void> {
        clearLogcat();
        return Promise.resolve()
    }

    readLog(): Promise<string> {
        return Promise.resolve(fs.readFileSync(`${this.currentDir}/logcat_dump.txt`, "utf8"));
    }

}