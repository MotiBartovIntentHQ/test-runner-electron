export interface DeviceLogAdapter { 
    startDeviceLogger(applicationId: string) : Promise<void>
    stopDeviceLogger() : Promise<void>
    clear() : Promise<void>
    readLog() : Promise<string>
}




