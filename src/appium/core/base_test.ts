import { remote, Browser } from "webdriverio";
import { EventEmitter, EventEmitterImpl } from "../services/event_emitter";
import * as fs from "fs";

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
    protected currentDir = process.cwd();

    constructor(name: string, description: string) {
      this.name = name;
      this.description = description;
    }


    protected getCurrentDir() : string {
      return this.currentDir;
    }

    protected logs() : string{
      return fs.readFileSync(`${this.getCurrentDir()}/logcat_dump.txt`, "utf8");
    }
  
    abstract execute(driver: WebdriverIO.Browser): Promise<TestResult>;
  }