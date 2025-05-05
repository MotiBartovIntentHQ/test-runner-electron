import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../core/base_test.js";
import * as fs from "fs";

export default class GenerateReportsTest extends BaseTest {
  constructor() {
    super("ReportsTest", "Generate and Send reports");
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    this.eventEmitter.log("Reports Test");

    try {
      const currentDir = process.cwd();

      
      await this.forceSendPeriodicReport(driver);
      await driver.pause(15000);
      const logs: string = fs.readFileSync(`${currentDir}/logcat_dump.txt`, "utf8");

      let status = TestStatus.PASS;

      if(!logs.includes("about to generate report: factoryName: JemaCampaignReportFactory")){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Failed to generate JemaCampaign report",
        };
      }

      if(!logs.includes("about to generate report: factoryName: EventsReportFactory")){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Failed to generate EventsReport",
        };
      }

      if(!logs.includes("about to post in 10 second generate") || !logs.includes("generate and send report")){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Failed to schedule reports job",
        };
      }

      if(!logs.includes("generateScheduledReports: factoryName: DailyUsageReportFactory")){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Failed to generate DailyUsageReport",
        };
      }

      // if(!logs.includes("generateScheduledReports: factoryName: DebugReportFactory")){
      //   status = TestStatus.FAIL
      //   return {
      //     test: this.name,
      //     description: this.description,
      //     status: status,
      //     error: "Failed to generate DebugReportFactory",
      //   };
      // }
      
      if(!logs.includes("generateScheduledReports: factoryName: EventsReportFactory")){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Failed to generate EventsReport",
        };
      }
      
      if(!logs.includes("generateScheduledReports: factoryName: StatsIReportFactory")){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Failed to generate Stats",
        };
      }
 
      if(!logs.includes("about to generate report: factoryName: MicrosegmentsSnapshot")){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Failed to generate MicrosegmentsSnapshot report",
        };
      }
      
      if(logs.includes("Failed to create a report")){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Failed to generate Stats",
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
