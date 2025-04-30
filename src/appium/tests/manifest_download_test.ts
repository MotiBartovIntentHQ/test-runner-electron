import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../core/base_test.js";
import * as fs from "fs";

export default class ManifestDownloadTest extends BaseTest {
  constructor() {
    super("ManifestDownloadTest", "Verifying remote config download successfully");
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    this.eventEmitter.log(`Execute Manifest Download Test`);

    try {
      const currentDir = process.cwd();
      this.eventEmitter.log(`Waiting for manifest download `);
      await driver.pause(5000);

      const logs: string = fs.readFileSync(`${currentDir}/logcat_dump.txt`, "utf8");

      let testStatus = TestStatus.PASS;
      
      if(!logs.includes("Campaigns manifest received") && !logs.includes("Manifest changed, saving new manifest")){
        console.log("Failed to verify manifest download")
        testStatus = TestStatus.FAIL;
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
