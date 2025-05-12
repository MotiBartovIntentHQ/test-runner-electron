import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";
import * as fs from "fs";
import { execSync } from "child_process";
import { remote, Browser } from "webdriverio";

const nativeCaps = {
  platformName: "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "emulator-5554",
  "appium:appPackage": `com.anagog.jema.flutter2.sampleapp`,
  "appium:appActivity": `.MainActivity`,
  "appium:noReset": true
};

export default class JemaNotifiactionClick extends BaseTest {
  constructor() {
    super("NotificationClickTest", "Verifying Campaign notification");
  }

  


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {

    this.eventEmitter.log(`execute JemaNotifiactionClick: driver: ${JSON.stringify(driver)}`)
    let nativeDriver = await createAndroidDriver(nativeCaps)

    this.eventEmitter.log(`nativeDriver: ${JSON.stringify(nativeDriver)}`)
    try {
      let testStatus = TestStatus.PASS;
      await this.openAndClickNotification(nativeDriver);
      await driver.pause(10000);

      const currentDir = process.cwd();
      let logs: string = fs.readFileSync(`${currentDir}/logcat_dump.txt`, "utf8");


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
    } finally {
      if(nativeDriver){
        await nativeDriver.deleteSession();
      }
    }
  }


  async openAndClickNotification(driver: WebdriverIO.Browser) {
    // Step 1: Open notification tray
    await driver.pause(10000);
    await driver.openNotifications();

    // Step 2: Find the notification (wait a bit in case notifications are loading)
    const  notification = driver.$('android=new UiSelector().textContains("Test flutter https Deeplink")');  
    if(notification === null){
      this.eventEmitter.log(`Notification not found`);
    } else {
      this.eventEmitter.log(`Found notification`);
    }
    
    await notification.longPress();
    await driver.pause(3000);;

    await notification.click()
    let delay = new Promise(resolve => setTimeout(resolve, 5000));
    await delay;
  }

  

}

async function createAndroidDriver(capabilities: any) : Promise<WebdriverIO.Browser> {
   const driver = await remote({
        hostname: process.env.APPIUM_HOST || 'localhost',
        port: 4723,
        logLevel: 'info',
        capabilities,
      });
      
      return driver;
  }

