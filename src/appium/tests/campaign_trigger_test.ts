import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../core/base_test.js";
import * as fs from "fs";

export default class CampaignTriggerTest extends BaseTest {
  constructor() {
    super("ConfigDownloadTest", "Verifying remote config download successfully");
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    console.log("execute Test1");



    try {
      await driver.background(-1);
      await driver.pause(5000);
      await driver.activateApp('com.anagog.jedai.jedaidemo');
      await driver.pause(5000);

      const currentDir = process.cwd();
      const logs: string = fs.readFileSync(`${currentDir}/logcat_dump.txt`, "utf8");

      let testStatus = TestStatus.FAIL;

      if(logs.includes("internalLambdaEvent: campaign_notification") && logs.includes("onCampaignTriggered, forward to event listeners")){
        console.log("Campaign triggered successfully")
        testStatus = TestStatus.PASS;
      }  else {
        console.log("Failed to identify a campaign trigger")
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
