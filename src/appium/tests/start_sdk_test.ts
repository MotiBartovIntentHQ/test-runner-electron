import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../core/base_test.js";
import * as fs from "fs";

export default class StartSdkTest extends BaseTest {
  constructor() {
    super("SdkInitialState", "Verify SDK disabled at startup");
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    console.log("execute Test1");



    try {
      const currentDir = process.cwd();

      console.log(`StartSdkTest: currentDir ${currentDir}`)
      
      await this.startSdkFromMenu(driver);
      await driver.pause(1000);
      const logs: string = fs.readFileSync(`${currentDir}/logcat_dump.txt`, "utf8");

      let status = TestStatus.PASS;
      if(!logs.includes("SDK State Changed from SUSPENDED to RUNNING")){
        status = TestStatus.FAIL
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
