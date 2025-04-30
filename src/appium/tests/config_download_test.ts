import { BaseTest, TestResult, TestStatus } from "../core/base_test.js";
import * as fs from "fs";

export default class ConfigDownloadTest extends BaseTest {
  constructor() {
    super("ConfigDownloadTest", "Verifying remote config download successfully");
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    this.eventEmitter.log(`Execute Config Download Test`);

    try {
      const currentDir = process.cwd();

      const logs: string = fs.readFileSync(`${currentDir}/logcat_dump.txt`, "utf8");
      let testStatus = TestStatus.PASS;
      
      if(!logs.includes("Successfully downloaded config from server")){
        testStatus = TestStatus.FAIL;
        this.eventEmitter.log(`Failed to download config from server`);
      } else {
        this.eventEmitter.log(`Successfully downloaded config from server`);
      }

      return {
        test: this.name,
        description: this.description,
        status: testStatus,
        error: "",
      };
    } catch (error: any) {
      return {
        test: this.name,
        description: this.description,
        status: TestStatus.FAIL,
        error: JSON.stringify(error),
      };
    }
  }
}
