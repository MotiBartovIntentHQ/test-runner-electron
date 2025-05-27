import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";
import { DeviceLogAdapter } from "../../services/log_adapter/log_adapter.js";
export default class InstallAndRun extends BaseTest {
  constructor({ logAdapter }: { logAdapter: DeviceLogAdapter }) {
    super({name: "InstallAndRun", 
      description: "Verify if start button is visible", 
      logAdapter: logAdapter});
  }

  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    try {
        await driver.pause(1000);

        const capabilities = JSON.parse(JSON.stringify(driver.capabilities));
        this.eventEmitter.log(`appPackage - ${capabilities["appPackage"]}`)

        const welcomeToJedAiPrompt = "Welcome to JedAI"
        const sdkInizializationCompleted = "JedAI initialization completed"
        const logs = await this.logs();
        
        this.eventEmitter.log(`logs: ${logs}`)
        if(!logs.includes(welcomeToJedAiPrompt) || !logs.includes(sdkInizializationCompleted)){
          return {
            test: this.name,
            description: this.description,
            status:  TestStatus.FAIL,
            error: "Unable to find SDK initialization prompts",
          };
        }

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
