import { remote, Browser } from "webdriverio";
import { EventEmitter, EventEmitterImpl } from "../services/event_emitter";
import { DeviceLogAdapter } from "../services/log_adapter/log_adapter";


export interface TestResult {
  test: string;
  description: string;
  status: TestStatus;
  error?: string;
}

export enum TestStatus {
    PASS = "PASS", FAIL = "FAIL"
}

export abstract class BaseTest {
    eventEmitter : EventEmitter = EventEmitterImpl.getInstance();
    name: string;
    description: string;
    protected deviceLogAdapter : DeviceLogAdapter;
    protected currentDir = process.cwd();

    constructor({name, description, logAdapter} : {name: string, description: string, logAdapter: DeviceLogAdapter}) {
      this.name = name;
      this.description = description;
      this.deviceLogAdapter = logAdapter;
    }


    protected getCurrentDir() : string {
      return this.currentDir;
    }

    protected async logs() : Promise<string> {
      return await this.deviceLogAdapter.readLog();
    }
  
    abstract execute(driver: WebdriverIO.Browser): Promise<TestResult>;
  }