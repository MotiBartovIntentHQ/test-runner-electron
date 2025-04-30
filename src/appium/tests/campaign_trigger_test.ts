import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../core/base_test.js";
import * as fs from "fs";

export default class CampaignTriggerTest extends BaseTest {
  constructor() {
    super("CampaignTriggerTest", "Verifying campaign trigger");
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    this.eventEmitter.log(`Execute Campaign Trigger Test`)

    try {
      await driver.pause(5000);
      await driver.background(-1);
      await driver.pause(5000);
      await driver.activateApp('com.anagog.jedai.jedaidemo');
      await driver.pause(15000);

      const currentDir = process.cwd();
      const logs: string = fs.readFileSync(`${currentDir}/logcat_dump.txt`, "utf8");

      let testStatus = TestStatus.FAIL;

      if(logs.includes("internalLambdaEvent: campaign_notification") && logs.includes("onCampaignTriggered, forward to event listeners")){
        this.eventEmitter.log("Campaign triggered successfully")
        testStatus = TestStatus.PASS;
      }  else {
        this.eventEmitter.log("Failed to identify a campaign trigger")
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
