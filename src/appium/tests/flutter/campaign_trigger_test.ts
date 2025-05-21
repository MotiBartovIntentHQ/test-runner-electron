import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";
import { NativeDriverHolder } from "./native_driver_holder.js";
export default class CampaignTriggerTest extends BaseTest {
  constructor() {
    super("CampaignTriggerTest", "Verifying campaign trigger");
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    this.eventEmitter.log(`Execute Campaign Trigger Test`)

        let nativeDriver = await NativeDriverHolder.getInstance()
    
    try {
      // await nativeDriver.background(2);
      const  currentPackage = await nativeDriver.getCurrentPackage();
      this.eventEmitter.log(`Current native pacakge: ${currentPackage}`)
      await nativeDriver.execute('mobile: backgroundApp');
      await nativeDriver.pause(2000);
      await nativeDriver.execute('mobile: activateApp', {'appId': currentPackage});

      await driver.pause(10000)
      
      const logs = this.logs();

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
