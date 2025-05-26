import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";

export default class ConfigDownloadTest extends BaseTest {
  constructor() {
    super("ConfigDownloadTest", "Verifying remote config download successfully");
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    this.eventEmitter.log(`Execute Config Download Test`);

    try {

      const logs = this.logs();
      let testStatus = TestStatus.PASS;
      
      if(!logs.includes("Successfully downloaded config from server")){
        testStatus = TestStatus.FAIL;
        this.eventEmitter.log(`Failed to download config from server`);
      } else {
        this.eventEmitter.log(`Successfully downloaded config from server`);
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
}
