import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";
import { DeviceLogAdapter } from "../../services/log_adapter/log_adapter.js";
import * as fs from "fs";

export default class OnboardingTest extends BaseTest {
  constructor({ logAdapter }: { logAdapter: DeviceLogAdapter }) {
    super({name: "OnboardingTest", 
      description: "Verify OnBoarding status", 
      logAdapter: logAdapter});
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    this.eventEmitter.log("OnBoarding Test");

    try {
      await this.startOnboardingFromMenu(driver);
      await driver.pause(5000);
      const logs = await this.logs();
      let status = TestStatus.PASS;
      const expectedLogIndicator = "DuringOnboarding"; // or the exact phrase to match

  if (!logs.includes(expectedLogIndicator)) {
  status = TestStatus.FAIL;
  return {
    test: this.name,
    description: this.description,
    status: status,
    error: `Expected onboarding status log "${expectedLogIndicator}" not found.`,
  };
} else {
  this.eventEmitter.log(`✅ Found onboarding status change: "${expectedLogIndicator}"`);
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

  async startOnboardingFromMenu(driver: WebdriverIO.Browser) {
    await this.clickThreeDots(driver)
    const lastMenuItem = await driver.$(
        'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("OnBoarding Start"))'
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
