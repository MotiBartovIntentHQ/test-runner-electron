import { remote, Browser } from "webdriverio";

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
    name: string;
    description: string;
  
    constructor(name: string, description: string) {
      this.name = name;
      this.description = description;
    }
  
    abstract execute(driver: WebdriverIO.Browser): Promise<TestResult>;
  }