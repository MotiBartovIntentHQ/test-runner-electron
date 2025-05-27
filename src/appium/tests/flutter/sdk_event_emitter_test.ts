import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";
import { DeviceLogAdapter } from "../../services/log_adapter/log_adapter.js";

export default class SdkEventEmitterTest extends BaseTest {
  constructor({ logAdapter }: { logAdapter: DeviceLogAdapter }) {
    super({name: "SdkEventEmitterTest", description: "SDK Event Emitter Test", logAdapter: logAdapter});
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    this.eventEmitter.log("SdkEventEmitterTest");

    try {
      const logs = await this.logs();
      const registerMessageListenerPrompt = `com.anagog.anagog_flutter.event_emitter.PluginAnagogMessageListener`
      
      let status = TestStatus.PASS;
      if(!logs.includes(registerMessageListenerPrompt)){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Unable to find register messageListener logs",
        };
      }

      const notifySubscribersPrompt = "notifySubscribers: There are 1 subscribers"

      if(!logs.includes(notifySubscribersPrompt)){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Unable to emitter notifySubscribers prompt",
        };
      }
    
      const emitSdkChanged = "emitEvent: com.anagog.jedai.anagog_api.model.Message$OnSdkStatusChanged";
      const emitCampaignTrigger = "emitEvent: com.anagog.jedai.anagog_api.model.Message$OnCampaignTriggered";
      const emitSnapshotReport = "emitEvent: com.anagog.jedai.anagog_api.model.Message$OnSnapshotReport"
      const emitNotificationClicked = "emitEvent: com.anagog.jedai.anagog_api.model.Message$OnNotificationClicked"

      //console.log(`Microsegment report match: ${matchResult}`)

      if(!logs.includes(emitSdkChanged) || !logs.includes(emitCampaignTrigger) || !logs.includes(emitSnapshotReport) || !logs.includes(emitNotificationClicked)){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Unable to find EventEmitter events prompts",
        };
      }

      return {
        test: this.name,
        description: this.description,
        status: TestStatus.PASS,
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

  async forceSendPeriodicReport(driver: WebdriverIO.Browser) {
    await this.clickThreeDots(driver)
    const lastMenuItem = await driver.$(
        'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Force Send Periodic Reports"))'
      );
      await lastMenuItem.click(); // Click the item after scrolling
  }

  async clickThreeDots(driver: WebdriverIO.Browser){
    try {
        const overflowMenu = await driver.$("~More options"); // Default content-desc for 3-dots menu
        await overflowMenu.click();
        console.log("✅ 3-Dots Overflow Menu Clicked!");
      } catch (error) {
        console.error("❌ Could not find Overflow Menu:", error);
      }
  }
}
