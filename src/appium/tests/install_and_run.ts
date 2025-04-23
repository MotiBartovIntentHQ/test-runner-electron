import { BaseTest, TestResult, TestStatus } from "../core/base_test.js";

export default class InstallAndRun extends BaseTest {
  constructor() {
    super("InstallAndRun", "Verify if start button is visible");
  }

  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    try {
        const capabilities = JSON.parse(JSON.stringify(driver.capabilities));
        console.log("appPackage: " + capabilities["appPackage"]);
        const element = await driver.$("//android.widget.TextView[contains(@text, 'JedAI')]");
        console.log(`element: ${JSON.stringify(element)}`);
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
