import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../core/base_test.js";
import * as fs from "fs";

export default class JemaNotifiactionClick extends BaseTest {
  constructor() {
    super("ConfigDownloadTest", "Verifying remote config download successfully");
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    console.log("execute JemaNotifiactionClick");
    try {
      const currentDir = process.cwd();
      const notificationClickPrompt = "Notification clicked for campaign:";
      const jeamOverallClicked = "about to get stat by query: JeMAEvents.overall.clicked"
      let logs: string = fs.readFileSync(`${currentDir}/logcat_dump.txt`, "utf8");
      let testStatus = TestStatus.FAIL;

      if(logs.includes(notificationClickPrompt)){
        testStatus = TestStatus.FAIL;
        console.log("There are notification click events before time..")
        return {
          test: this.name,
          description: this.description,
          status: testStatus,
          error: "There are notification click events before time.",
        };
      }

      await this.openAndClickNotification(driver);

      logs = fs.readFileSync(`${currentDir}/logcat_dump.txt`, "utf8");

      if(logs.includes("Notification clicked for campaign:") ){
        console.log("Campaign triggered successfully")
        testStatus = TestStatus.PASS;
      }  else {
        console.log("Failed to identify a notification clicked")
      }

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

