import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";
import * as fs from "fs";

export default class CampaignDownloadTest extends BaseTest {
  constructor() {
    super("ConfigDownloadTest", "Verifying remote config download successfully");
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    console.log("execute Test1");



    try {
      const currentDir = process.cwd();
      await driver.pause(10000);
      const logs: string = fs.readFileSync(`${currentDir}/logcat_dump.txt`, "utf8");

      
      let testStatus = TestStatus.FAIL;
      // com.anagog.jema.flutter2.sampleapp
      const regex = /https:\/\/jema-campaigns\.anagog\.com\/[a-f0-9]+\/[\w\.]+\/[A-F0-9\-]+\.campaign\.zip completed successfully/
      

      const matchResult = regex.test(logs);
      console.log(`Campaign artifacts download matchResult: ${matchResult}`)

      if(logs.includes("About to download the following campaigns") && matchResult){
        console.log("Campaign artifacts downloaded successfully")
        testStatus = TestStatus.PASS;
      }  else {
        console.log("Failed to download campaign artifacts")
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
