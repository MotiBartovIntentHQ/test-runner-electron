import { BaseTest, TestResult, TestStatus } from "../core/base_test.js";
import { EventEmitterImpl } from "../services/event_emitter.js";

export default class InstallAndRun extends BaseTest {
  constructor() {
    super("InstallAndRun", "Verify if start button is visible");
  }

  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    try {
        await driver.pause(1000);

        const capabilities = JSON.parse(JSON.stringify(driver.capabilities));
        this.eventEmitter.log(`appPackage - ${capabilities["appPackage"]}`)
        const element = await driver.$("//android.widget.TextView[contains(@text, 'JedAI')]");
        this.eventEmitter.log(`element - ${JSON.stringify(element)}`)
        const viewExists = element != null
      return {
        test: this.name,
        description: this.description,
        status: viewExists == true ? TestStatus.PASS : TestStatus.FAIL,
        error: !viewExists == false ? undefined  : "Button not visible",
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
