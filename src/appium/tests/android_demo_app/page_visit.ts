import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";

export default class PageVisitTest extends BaseTest {
  constructor() {
    super("PageVisitTest", "Verifying PageVisit and PageTracker");
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    console.log("execute ApiPendingQueue");
    try {


      const currentDir = process.cwd();
     
      const pageVisit = "textParameters={PageName=MainActivity}";
      const eventIdentifier = "identifier='PageVisit'";

      const pageLastVisitDateLog = "about to set stats in cache: PageLastVisitDate"
      const pageLastVisitLog = "about to set stats in cache: PageLastVisit"

      const pageLastVisitLambdaLog = "about to run event[PageVisit]"
  
      let logs = this.logs();
      let testStatus = TestStatus.PASS;


      if(!logs.includes(pageLastVisitDateLog)){
        testStatus = TestStatus.FAIL;
        const error = "Unable to find PageLastVisitDate log"
        return {
          test: this.name,
          description: this.description,
          status: testStatus,
          error: error,
        };
      }

      if(!logs.includes(pageLastVisitLog)){
        testStatus = TestStatus.FAIL;
        const error = "Unable to find PageLastVisit log"

        return {
          test: this.name,
          description: this.description,
          status: testStatus,
          error: "Unable to find SDK Version pending api",
        };
      }

      if(!logs.includes(pageVisit) || !logs.includes(eventIdentifier)){
        testStatus = TestStatus.FAIL;
        const error = "Unable to find PageVisit app event";
        return {
          test: this.name,
          description: this.description,
          status: testStatus,
          error: error,
        };
      }

      // if(!logs.includes(pageLastVisitLambdaLog) ){
      //   testStatus = TestStatus.FAIL;
      //   const error = "Unable to find PageVisit AppEvent lambda log";
      //   return {
      //     test: this.name,
      //     description: this.description,
      //     status: testStatus,
      //     error: error,
      //   };
      // }

      return {
        test: this.name,
        description: this.description,
        status: testStatus,
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


  async openAndClickNotification(driver: WebdriverIO.Browser) {
    // Step 1: Open notification tray
    await driver.pause(10000);
    await driver.openNotifications();

    // Step 2: Find the notification (wait a bit in case notifications are loading)
    const  notification = driver.$('android=new UiSelector().textContains("Test app open")');  
  
    await notification.longPress();
    await driver.pause(3000);;

    await notification.click()
  

    await driver.pause(5000);

  }


}

