import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";
import { clearLogcat, startLogcat, stopLogcat } from '../../services/logcat.js';
import { NativeDriverHolder } from "./native_driver_holder.js";
import { spawn, execSync, ChildProcessByStdio } from "child_process";
import { swipeAndroidApp } from "../../services/app_swiper.js";

export default class SdkBackgroundWakeupTest extends BaseTest {
  constructor() {
    super("SdkWakeupTest", "SDK Wakeup test");
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    this.eventEmitter.log("Reports Test");

    const start = Date.now();
    const duration = 5 * 60 * 1000;

    try {
         let nativeDriver = await NativeDriverHolder.getInstance()
         let status = TestStatus.PASS;

         const appPackage = await nativeDriver.getCurrentPackage();

      stopLogcat();
      clearLogcat();

      await swipeAndroidApp(nativeDriver)

      await driver.pause(2000)

      

      while (Date.now() - start < duration) {
        console.log("⏳ Running iteration at", new Date().toISOString());
  
        try {
          const pid = execSync(`adb shell pidof -s ${appPackage}`).toString().trim()
          this.eventEmitter.log(`Waiting for process to reopen: pid: ${pid}`)

          if(pid !== null){
            startLogcat(appPackage);
            break;
          }
          await nativeDriver.pause(1500); // wait 1 second between iterations
          await driver.pause(1500);

        } catch(e){
        }
      }

      await nativeDriver.pause(1500); // wait 1 second between iterations
      await driver.pause(1500);
      let logs = this.logs()

      if(!logs.includes("SDK State Changed from DISABLED to RUNNING")){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Failed to find SDK start in background",
        };
      }

      return {
        test: this.name,
        description: this.description,
        status: status,
        error: "",
      };
    } catch (error: any) {
      this.eventEmitter.error(`Something went wrong: ${error}`)
      return {
        test: this.name,
        description: this.description,
        status: TestStatus.FAIL,
        error: JSON.stringify(error),
      };
    }
  }

  // async swipeAndroidApp(driver: WebdriverIO.Browser) {
  //   await driver.pressKeyCode(187); // KEYCODE_APP_SWITCH
  //   await driver.pause(1000); 
  
  //   await driver.performActions([
  //       {
  //         type: "pointer",
  //         id: "finger1",
  //         parameters: { pointerType: "touch" },
  //         actions: [
  //           { type: "pointerMove", duration: 0, x: 500, y: 1000 }, // Start point
  //           { type: "pointerDown", button: 0 },
  //           { type: "pause", duration: 200 },
  //           { type: "pointerMove", duration: 300, x: 500, y: 0 }, // Swipe up
  //           { type: "pointerUp", button: 0 }
  //         ]
  //       }
  //     ]);
  //     await driver.releaseActions();
  //     await driver.pause(1000); 
  //     await driver.pressKeyCode(3);  //Press the home button
  // }
  
}

