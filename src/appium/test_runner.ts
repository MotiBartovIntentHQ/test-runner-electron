import { remote, Browser } from "webdriverio";
import { BaseTest, TestResult, TestStatus } from "./core/base_test.js";
import path from "path";
import { createObjectCsvWriter } from "csv-writer";
import fs, { PathLike } from "fs";
import { extendBrowser } from "./core/browser_extensions.js";

import {startLogcat, stopLogcat} from '../appium/services/logcat.js';
import {ProfileManagerImpl as profileManager} from "./core/profile-manager/profile-manager.js";
import { EventEmitterImpl } from "./services/event_emitter.js";
// 🔹 Set up CSV Writer

const eventEmitter = EventEmitterImpl.getInstance();

const resultsPath = path.join(__dirname, "test_results.csv");
const csv = createObjectCsvWriter({
  path: resultsPath,
  header: [
    { id: "test", title: "Test Name" },
    { id: "description", title: "Description" },
    { id: "status", title: "Status" },
    { id: "error", title: "Error (if any)" },
  ],
});


// 🔹 Appium Server URL
const APPIUM_SERVER = "http://127.0.0.1:4723/wd/hub";

// console.log("All args:", process.argv);

const currentDir = process.cwd();

const apkPath = process.argv[3];

// 🔹 Desired Capabilities
const capabilities = {
  platformName: 'Android',
  'appium:deviceName': 'emulator-5554', // Change to your device name from `adb devices`
  'appium:app': apkPath, // Update with the APK path
  'appium:appPackage': 'com.anagog.jedai.jedaidemo', // Replace with actual package name
  'appium:appActivity': '.MainActivity', // Replace with actual main activity
  'appium:automationName': 'UiAutomator2',
  'appium:autoGrantPermissions': true, // Automatically grants permissions
  'appium:noReset': false, // Ensures app is reinstalled every test run
  'appium:fullReset': true
};

  (async () => {
    let driver : WebdriverIO.Browser | null = null;
    const results: TestResult[] = [];

    try {
      // 🔹 Connect to Appium
      eventEmitter.start();
      eventEmitter.log("🚀 -------------------------------------------- Starting Appium tests - initializing -----------------------------------------")

      driver = await setupDriver()
      await initializeLog(driver);
     
      let pManager = profileManager.getInstance()
      pManager.init(process.argv[2]);
      let testCases = (await pManager.readTestProfile()).filter(item => item.enabled);
        for(let index = 0; index < testCases.length; index++) {

        const testInfo = testCases[index];
        eventEmitter.log(`-------------------------------------------🔹 Running ${testInfo.name} test ---------------------------------------`)
        eventEmitter.testStart(index)
        try {
          // 🔹 Dynamically import the test class
          const TestModule = await import(testInfo.testPath);
          const TestClass = TestModule.default || TestModule[testInfo.name];
          console.log(`🔹 Running test class: ${TestClass.name}`);

          const testInstance: BaseTest = new TestClass();
  
          // 🔹 Execute the test
          const result = await testInstance.execute(driver);
          results.push(result);
          eventEmitter.log(`----------------------- ${TestClass.name} ${result.status === TestStatus.PASS ? `PASSED ✅` : `FAILED!! 🟥`} -----------------------`);

          eventEmitter.testStop(  index, result.status);
        } catch (error: any) {
          eventEmitter.error(`------------------------------------ ❌ Error loading or executing ${testInfo.name}: ------------------------------------`);
          eventEmitter.error(`------------------------------------ ❌ ${error.message}: ------------------------------------ ${__dirname}`);
          eventEmitter.testStop( index, TestStatus.FAIL);
          results.push({
            test: testInfo.name,
            description: testInfo.description,
            status: TestStatus.FAIL,
            error: error.message,
          });
        }
      }
      eventEmitter.log( `🚀 -------------------------------------------- Appium tests finished -----------------------------------------`);    
    } catch (error) {
      eventEmitter.error( `❌ Test failed ${JSON.stringify(error)}`);
      
    } finally {
      if (driver) {
        await driver.deleteSession();
        eventEmitter.log( `🎯 Test completed!`);    
      }
    }

    const hasFailed  = results.some(result => result.status === TestStatus.FAIL);

    eventEmitter.log(`🚀 -------------------------------------------- Appium tests finished with status - ${hasFailed ? `FAILED!! 🟥` : `PASSED ✅`} -----------------------------------------`);    
    stopLogcat();
    await csv.writeRecords(results);
    eventEmitter.log(`📊 Test report saved: ${resultsPath}`);    
  })();

  async function setupDriver() : Promise<WebdriverIO.Browser> {
   const driver = await remote({
        hostname: process.env.APPIUM_HOST || 'localhost',
        port: 4723,
        logLevel: 'info',
        capabilities,
      });
      extendBrowser(driver)
      return driver;
  }

async function initializeLog(driver: WebdriverIO.Browser){
    await driver.pause(1000);
    const packageName = await (driver as any).getAppPackageName();
    startLogcat(packageName)
}

function deleteFileIfExists(filePath: PathLike) {
    if (fs.existsSync(filePath)) {
      console.log(`📌 File "${filePath}" exists, deleting...`);
      fs.unlinkSync(filePath);
      console.log("✅ File deleted successfully!");
    } else {
      console.log(`❌ File "${filePath}" does not exist.`);
    }
  }

  