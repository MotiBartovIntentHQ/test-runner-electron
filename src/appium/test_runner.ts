import { remote, Browser } from "webdriverio";
import { BaseTest, TestResult, TestStatus } from "./core/base_test.js";
import path from "path";
import { createObjectCsvWriter } from "csv-writer";
import fs, { PathLike } from "fs";
import { extendBrowser } from "./core/browser_extensions.js";

import {startLogcat, stopLogcat} from '../appium/services/logcat.js';
import ProfileManagerImpl from "./core/profile-manager/profile-manager.js";

 const __dirname = path.resolve();
 const profileManager = new ProfileManagerImpl(process.argv[2]);

// 🔹 Set up CSV Writer

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

console.log("All args:", process.argv);

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
      console.log("🚀 -------------------------------------------- Starting Appium tests -----------------------------------------");
      driver = await setupDriver()
      await initializeLog(driver);
     
      let testCases = await profileManager.readTestProfile()
      for (const testInfo of testCases) {
        console.log(`-------------------------------------------🔹 Running: ${testInfo.name} ---------------------------------------`);
        try {
          // 🔹 Dynamically import the test class
          const TestModule = await import(testInfo.testPath);
          const TestClass = TestModule.default || TestModule[testInfo.name];
          console.log(`🔹 Running test class: ${TestClass.name}`);

          const testInstance: BaseTest = new TestClass();
  
          // 🔹 Execute the test
          const result = await testInstance.execute(driver);
          results.push(result);
          console.log(`----------------------- Test: ${TestClass.name} result: ${JSON.stringify(result.status)} -----------------------`)

        } catch (error: any) {
          console.error(`------------------------------------ ❌ Error loading or executing ${testInfo.name}: ------------------------------------` );
          results.push({
            test: testInfo.name,
            description: testInfo.description,
            status: TestStatus.FAIL,
            error: error.message,
          });
        }
      }
      console.log("🚀 -------------------------------------------- Appium tests finished -----------------------------------------");
    
    } catch (error) {
      console.error("❌ Test failed:", error);
    } finally {
      if (driver) {
        await driver.deleteSession();
        console.log("🎯 Test completed!");
      }
    }

    const hasFailed  = results.some(result => result.status === TestStatus.FAIL);

    console.log(`🚀 -------------------------------------------- Appium tests finished with status - ${hasFailed ? "FAILED!! 🟥" : "PASSED ✅"} -----------------------------------------`);

    stopLogcat();
    await csv.writeRecords(results);
    console.log(`📊 Test report saved: ${resultsPath}`);
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

  