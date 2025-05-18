import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";
import * as fs from "fs";
import { execSync } from "child_process";
import { remote, Browser } from "webdriverio";
import { NativeDriverHolder } from "./native_driver_holder.js";

export default class JemaNotifiactionClick extends BaseTest {
  constructor() {
    super("NotificationClickTest", "Verifying Campaign notification");
  }

  


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {

    this.eventEmitter.log(`execute JemaNotifiactionClick: driver: ${JSON.stringify(driver)}`)
    let nativeDriver = await NativeDriverHolder.getInstance()

    this.eventEmitter.log(`nativeDriver: ${JSON.stringify(nativeDriver)}`)
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

      await this.openAndClickNotification(nativeDriver);

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
    const  notification = driver.$('android=new UiSelector().textContains("Test flutter notification2")');  
    
    if(notification === null){
      this.eventEmitter.log(`Notification not found`);
    } else {
      this.eventEmitter.log(`Found notification`);
    }
    
    await notification.longPress();
    const location = await notification.getLocation();
    const size = await notification.getSize();
    await driver.pause(3000);;

    try{

      const x = location.x + size.width / 2;
      const y = location.y + size.height / 2;
  
      await driver.performActions([
        {
          type: "pointer",
          id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            { type: "pointerMove", duration: 0, x, y },
            { type: "pointerDown", button: 0 },
            { type: "pause", duration: 100 },
            { type: "pointerUp", button: 0 }
          ]
        }
      ]);

      // await notification.click()
    } catch(e) {
      this.eventEmitter.error(`Notification click error: ${e}`);
    }
    await driver.pause(5000);
  }

  

}

