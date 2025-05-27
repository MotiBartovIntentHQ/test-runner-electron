import { app } from "electron";
import { AndroidLogAdapter } from "./android_log_adapter";
import { IosLogAdapter } from "./ios_log_adapter";
import { DeviceLogAdapter } from "./log_adapter";

export interface LogAdapterFactory { 
    provideLogAdapter(platform: string) : DeviceLogAdapter
}


export class LogAdapterFactoryImpl implements LogAdapterFactory{
    provideLogAdapter(platform: string): DeviceLogAdapter {
        if(platform === "IOS"){
            return new IosLogAdapter()
        } else {
            return new AndroidLogAdapter()
        }
    }
}