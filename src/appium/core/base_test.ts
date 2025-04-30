import { remote, Browser } from "webdriverio";
import { EventEmitter, EventEmitterImpl } from "../services/event_emitter";
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
  
    constructor(name: string, description: string) {
      this.name = name;
      this.description = description;
    }
  
    abstract execute(driver: WebdriverIO.Browser): Promise<TestResult>;
  }