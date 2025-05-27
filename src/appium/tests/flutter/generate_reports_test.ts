import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";
import {byValueKey} from "appium-flutter-finder";
import { DeviceLogAdapter } from "../../services/log_adapter/log_adapter.js";

export default class GenerateReportsTest extends BaseTest {
  constructor({ logAdapter }: { logAdapter: DeviceLogAdapter }) {
    super({name: "ReportsTest", description: "Generate and Send reports", logAdapter: logAdapter});
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    this.eventEmitter.log("Reports Test");

    try {
      
      await this.scrollToButton(driver);
      await driver.pause(15000);
      const logs = await this.logs();
      let status = TestStatus.PASS;


    if(!logs.includes("onMethodCall: method: forceScheduleReports")){
      status = TestStatus.FAIL
      return {
      test: this.name,
       description: this.description,
       status: status,
        error: "Unable to file plugin forceScheduleReports method call",
      };
    }


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

  async scrollToButton(driver: WebdriverIO.Browser) {
    await driver.execute('flutter:scrollIntoView', byValueKey('ScheduleReports'), {alignment: 0.1})
    let buttonFinder = byValueKey("ScheduleReports")

    await driver.elementClick(buttonFinder);
  }
}
  

