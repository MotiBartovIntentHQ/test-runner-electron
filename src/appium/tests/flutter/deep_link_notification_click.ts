import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";
import { NativeDriverHolder } from "../../services/native_driver_holder.js";
import { byValueKey } from "appium-flutter-finder";
import { swipeAndroidApp } from "../../services/app_swiper.js";
import { DeviceLogAdapter } from "../../services/log_adapter/log_adapter.js";
export default class DeepLinkNotificationClick extends BaseTest {
  constructor({ logAdapter }: { logAdapter: DeviceLogAdapter }) {
    super({name: "DeepLinkNotificationClick", 
      description: "Verifying DeepLink Click notification", 
      logAdapter: logAdapter});
  }

  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {

    this.eventEmitter.log(`execute DeepLinkNotificationClick: driver: ${JSON.stringify(driver)}`)

    // await NativeDriverHolder.destroy();
    let nativeDriver = await NativeDriverHolder.getInstance()
    await nativeDriver.execute('mobile: activateApp', {'appId': 'com.anagog.jema.flutter2.sampleapp'});

    const element =  byValueKey('Application Title');
    this.eventEmitter.log(`element - ${JSON.stringify(element)}`)
    const viewExists = element != null
    
    this.eventEmitter.log(`nativeDriver: ${JSON.stringify(nativeDriver)}`)
    try {
      let testStatus = TestStatus.PASS;

      await this.deviceLogAdapter.stopDeviceLogger()
      await this.deviceLogAdapter.clear();
      
      await swipeAndroidApp(nativeDriver)
      
      await driver.pause(2000)   
      await this.openAndClickNotification(nativeDriver);
      await NativeDriverHolder.destroy()    
      nativeDriver = await NativeDriverHolder.getInstance()
      let appPackage = await nativeDriver.getCurrentPackage()
      this.deviceLogAdapter.startDeviceLogger(appPackage)

      await driver.pause(2000);
      const deepLinkLog = "About to handle linkUrl: "

      let logs = await this.logs();

      if(!logs.includes(deepLinkLog)){
        return {
          test: this.name,
          description: this.description,
          status: TestStatus.FAIL,
          error: "Unable to find deep link handle log!",
        };
      }

      await driver.pause(1000);

      const bottomNavigation =  await nativeDriver.$('android=new UiSelector().description("DebugScreenBottomNavigation")');  
      const foundElementError = bottomNavigation.error;
      const errorMessage = (await foundElementError)?.message
      this.eventEmitter.log(`Found bottom navigation error message: ${errorMessage}`)

      if(errorMessage?.includes("An element could not be located")){
        return {
          test: this.name,
          description: this.description,
          status: TestStatus.FAIL,
          error: "Unable to find debug screen",
        };
      }

      try{
        await nativeDriver.back();
      } catch(error){
        //todo investigate why like this..
        this.eventEmitter.error(`Something went wrong when trying to click back button: ${error}`)
      }
      
      await driver.pause(1000);

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
        error: `There was an exception: ${JSON.stringify(error)}`,
      };
    } 
  }


  async openAndClickNotification(driver: WebdriverIO.Browser) {
    // Step 1: Open notification tray
    await driver.pause(1000);
    await driver.openNotifications();
    await driver.pause(500);;

    // Step 2: Find the notification (wait a bit in case notifications are loading)
    const notification =  driver.$('android=new UiSelector().textContains("Test flutter https Deeplink")');  
    if(notification === null){
      this.eventEmitter.log(`Notification not found \n`);
    } else {
      this.eventEmitter.log(`Found notification \n`);
    }
    
    await notification.longPress();
    const location = await notification.getLocation();
    const size = await notification.getSize();

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
            { type: "pause", duration: 500 },
            { type: "pointerUp", button: 0 }
          ]
        }
      ]);

    } catch(e) {
      this.eventEmitter.error(`Notification click error: ${e}`);
    }
  }
}
