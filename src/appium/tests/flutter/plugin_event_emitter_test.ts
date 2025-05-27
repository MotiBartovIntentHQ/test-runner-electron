import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";
import { DeviceLogAdapter } from "../../services/log_adapter/log_adapter.js";

export default class FlutterPluginEventEmitter extends BaseTest {
  constructor({ logAdapter }: { logAdapter: DeviceLogAdapter }) {
    super({name: "FlutterPluginEventEmitter", 
      description: "Flutter EventEmitter test", 
      logAdapter: logAdapter});
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    this.eventEmitter.log("FlutterPluginEventEmitter test");

    try {
      const logs = await this.logs();
      
      let status = TestStatus.PASS;
    
      const foregroundEmitterOnSdkStateChanged = "ForegroundEventEmitter 2 main INFO onNewMessage: com.anagog.jedai.anagog_api.model.Message$OnSdkStatusChanged";
      const foregroundEmitterOnSnapshotReport = "ForegroundEventEmitter 2 main INFO onNewMessage: com.anagog.jedai.anagog_api.model.Message$OnSnapshotReport";
      const foregroundEmitterOnCampaignTriggered = "ForegroundEventEmitter 2 main INFO onNewMessage: com.anagog.jedai.anagog_api.model.Message$OnCampaignTriggered";
      const foregroundEmitterOnNotificationClick = "ForegroundEventEmitter 2 main INFO onNewMessage: com.anagog.jedai.anagog_api.model.Message$OnNotificationClicked";


      //console.log(`Microsegment report match: ${matchResult}`)

      if(!logs.includes(foregroundEmitterOnSdkStateChanged) || !logs.includes(foregroundEmitterOnSnapshotReport) || !logs.includes(foregroundEmitterOnCampaignTriggered) || !logs.includes(foregroundEmitterOnNotificationClick)){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Unable to find Plugin ForegroundEventEmitter events prompts",
        };
      }

      const homePageEventSdkStateChanged = "flutter : application - onAnagogEvent {action: onJedAIStatusChange, payload: {status: true}}"
      const homePageEventSdkCampaignTriggered = "application - onAnagogEvent {action: onCampaignTriggered, payload:"
      const homePageEventSdkNotificationClick = "flutter : application - onAnagogEvent {action: onNotificationClick, payload:"
      const homePageEventSdkSnapshotReport = "flutter : application - onAnagogEvent {action: onSnapshotReport, payload:" 

      if(!logs.includes(foregroundEmitterOnSdkStateChanged) || !logs.includes(foregroundEmitterOnSnapshotReport) || !logs.includes(foregroundEmitterOnCampaignTriggered) || !logs.includes(foregroundEmitterOnNotificationClick)){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Unable to find Plugin ForegroundEventEmitter events prompts",
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
