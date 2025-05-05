import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../core/base_test.js";
import * as fs from "fs";

export default class MicrosegmentsReportsTest extends BaseTest {
  constructor() {
    super("MicrosegmentsReportTest", "Generate and send microsegments report");
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    this.eventEmitter.log("Reports Test");

    try {
      const currentDir = process.cwd();

      
      await driver.pause(15000);
      const logs: string = fs.readFileSync(`${currentDir}/logcat_dump.txt`, "utf8");

      
      let status = TestStatus.PASS;
      if(!logs.includes("About to generate report: StatsIReportFactory")){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Failed to find generate microsegments report logs",
        };
      }

      if(!logs.includes("About to get stats for report") || !logs.includes("Report stats gathering finished")){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Failed to find StatsReportFactory logs",
        };
      }

      const regex = /Report was generated: .*\/StatsIReportFactory-[^\/]+\.gz/;

      const matchResult = regex.test(logs);
      this.eventEmitter.log(`Microsegment report match ${matchResult}`)
      //console.log(`Microsegment report match: ${matchResult}`)

      if(!matchResult){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Failed to find generate microsegments",
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
