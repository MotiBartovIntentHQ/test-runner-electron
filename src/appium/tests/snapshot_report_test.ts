import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../core/base_test.js";
import * as fs from "fs";

export default class SnapshotReportTest extends BaseTest {
  constructor() {
    super("SnapshotReportTest", "Generate Snapshot Report Test");
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    this.eventEmitter.log("Reports Test");

    try {
      const currentDir = process.cwd();

      
      await driver.pause(10000);
      const logs: string = fs.readFileSync(`${currentDir}/logcat_dump.txt`, "utf8");

      
      let status = TestStatus.PASS;
      if(!logs.includes("about to generate report: factoryName: MicrosegmentsSnapshot")){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Failed to find generate microsegments snapshot report logs",
        };
      }

      if(!logs.includes("About to generate report: [MicrosegmentsSnapshot]") || !logs.includes("output snapshot size")){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Unable to find Microsegment snapshot generate report",
        };
      }

      const regex = /Report was generated: .*\/MicrosegmentsSnapshot-[^\/]+\.gz/;

      const matchResult = regex.test(logs);
      this.eventEmitter.log(`Microsegment snapshot report match ${matchResult}`)
      //console.log(`Microsegment report match: ${matchResult}`)

      if(!matchResult){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Failed to find generate microsegments snapshot report file",
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
