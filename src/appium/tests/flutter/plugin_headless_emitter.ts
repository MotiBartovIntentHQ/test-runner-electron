import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";
import { DeviceLogAdapter } from "../../services/log_adapter/log_adapter.js";

export default class FlutterHeadlessEventEmitter extends BaseTest {
  constructor({ logAdapter }: { logAdapter: DeviceLogAdapter }) {
    super({name: "FlutterHeadlessEventEmitter", 
      description: "Flutter headless BackgroundEventEmitter test", 
      logAdapter: logAdapter});
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    this.eventEmitter.log("FlutterPluginEventEmitter test");

    try {
      const logs = await this.logs();
      
      let status = TestStatus.PASS;
    
      const backgroundEmitterOnCampaignTriggered = "BackgroundEventEmitter 2 main INFO onNewMessage: com.anagog.jedai.anagog_api.model.Message$OnCampaignTriggered";

      if(!logs.includes(backgroundEmitterOnCampaignTriggered) ){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Unable to find Plugin BackgroundEventEmitter events prompts",
        };
      }

      const internalMethodChannel = "[INTERNAL_METHOD_CHANNEL] onMessageCall: PluginInternalMessage#eventEmitterMessage";
      const internalMethodChannelEventEmitterMessage = "[INTERNAL_METHOD_CHANNEL]: sdkEventEmitterMessage: {campaign_identifier:";
  
      if(!logs.includes(internalMethodChannel) || !logs.includes(internalMethodChannelEventEmitterMessage)){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Unable to find Plugin internalMethodChannel events prompts",
        };
      }

      const headlessCallbackCampaignTrigger = "[anagogHeadlessCallback] ON_CAMPAIGN_TRIGGERED";

      if(!logs.includes(headlessCallbackCampaignTrigger) ){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Unable to find headlessCallbackCampaignTrigger events prompts",
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
