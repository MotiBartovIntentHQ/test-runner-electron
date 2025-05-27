import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";
import { DeviceLogAdapter } from "../../services/log_adapter/log_adapter.js"

export default class CampaignDownloadTest extends BaseTest {
  constructor({ logAdapter }: { logAdapter: DeviceLogAdapter }) {
    super({name: "ConfigDownloadTest", 
      description: "Verifying remote config download successfully", 
      logAdapter: logAdapter});
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    console.log("execute Test1");



    try {
      const currentDir = process.cwd();
      await driver.pause(10000);
      const logs = await this.logs();

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
