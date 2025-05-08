import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";
import { EventEmitterImpl } from "../../services/event_emitter.js";
const flutterFinder = require("appium-flutter-finder");

export default class InstallAndRun extends BaseTest {
  constructor() {
    super("InstallAndRun", "Verify if start button is visible");
  }

  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    try {
        await driver.pause(1000);

       let flutterOk =  await driver.execute('flutter:checkHealth');
         await driver.execute('flutter:clearTimeline');
         await driver.execute('flutter:forceGC');
        const capabilities = JSON.parse(JSON.stringify(driver.capabilities));
        this.eventEmitter.log(`appPackage - ${capabilities["appPackage"]}`)
        const element = await driver.execute('flutter:waitFor', flutterFinder.byValueKey('Application Title'));
        //const element = await driver.findElement("flutter", "Application Title");
        this.eventEmitter.log(`element - ${JSON.stringify(element)}`)
        const viewExists = element != null
      return {
        test: this.name,
        description: this.description,
        status: viewExists == true ? TestStatus.PASS : TestStatus.FAIL,
        error: !viewExists == false ? undefined  : "Application title not found",
      };
    } catch (error: any) {
      return {
        test: this.name,
        description: this.description,
        status: TestStatus.FAIL,
        error: error.message,
      };
    }
  }
}
