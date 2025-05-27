import { DeviceLogAdapter } from "./log_adapter";

export class IosLogAdapter implements DeviceLogAdapter {

    startDeviceLogger(applicationId: string): Promise<void> {
        return Promise.resolve();
    }
    stopDeviceLogger(): Promise<void> {        
        return Promise.resolve()
    }
    
    clear(): Promise<void> {
        return Promise.resolve()
    }
    readLog(): Promise<string> {
        return Promise.resolve("")
    }

}