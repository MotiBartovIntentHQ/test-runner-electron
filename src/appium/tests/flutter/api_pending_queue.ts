import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";
import { DeviceLogAdapter } from "../../services/log_adapter/log_adapter.js";

export default class ApiPendingQueue extends BaseTest {
  constructor({ logAdapter }: { logAdapter: DeviceLogAdapter }) {
    super({name: "ApiPendingQueue", 
      description: "Verifying pending apis before SDK running", 
      logAdapter: logAdapter});
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    console.log("execute ApiPendingQueue");
    try {
      const updateConfigPendingOperation = "SDK not running yet, enqueue pending operation JedaiSdkStarterImpl::updateConfigIfRequired";

      const pendingApisLog = /There are \d+ enqueued pending operation/
      const flushPendingApis = /There are \d+ pending operation, executing them all/
      let logs = await this.logs();
      let testStatus = TestStatus.PASS;

      const pendingApiLogMatchResult = pendingApisLog.test(logs);

      if(!updateConfigPendingOperation){
        testStatus = TestStatus.FAIL;
        console.log("Unable to find PageVisit pending api")
        return {
          test: this.name,
          description: this.description,
          status: testStatus,
          error: "Unable to find PageVisit pending api",
        };
      }

      if(!pendingApiLogMatchResult){
        testStatus = TestStatus.FAIL;
        console.log("Unable to find pending apis logs!, there should be at least 5")
        return {
          test: this.name,
          description: this.description,
          status: testStatus,
          error: "Unable to find pending apis logs!, there should be at least 5",
        };
      }


      const pendingApiFlushMatchResult = flushPendingApis.test(logs);

      if(!pendingApiFlushMatchResult){
        testStatus = TestStatus.FAIL;
        console.log("Unable to find execute of pending apis logs!")
        return {
          test: this.name,
          description: this.description,
          status: testStatus,
          error: "Unable to find execute of pending apis logs!",
        };
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

