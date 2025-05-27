import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";
import { DeviceLogAdapter } from "../../services/log_adapter/log_adapter.js";

export default class StartSdkTest extends BaseTest {
  constructor({ logAdapter }: { logAdapter: DeviceLogAdapter }) {    
    super({name: "StartSdkTest", 
      description: "Verify SDK disabled at startup", 
      logAdapter: logAdapter});
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    this.eventEmitter.log("StartSdkTest Test");

    try {
      
      await this.startSdkFromMenu(driver);
      await driver.pause(5000);
      const logs = await this.logs();

      let status = TestStatus.PASS;
      if(!logs.includes("onSdkStateChanged: RUNNING")){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Failed to start SDK",
        };
      } else {
        this.eventEmitter.log(`SDK Up And Running`)
      }

      return {
        test: this.name,
        description: this.description,
        status: status,
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

  async startSdkFromMenu(driver: WebdriverIO.Browser) {
    await this.clickThreeDots(driver)
    const lastMenuItem = await driver.$(
        'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Start SDK"))'
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
