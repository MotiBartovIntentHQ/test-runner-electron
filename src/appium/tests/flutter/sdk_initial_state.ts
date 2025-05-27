import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";
import { DeviceLogAdapter } from "../../services/log_adapter/log_adapter.js";

export default class SdkInitialState extends BaseTest {
  constructor({ logAdapter }: { logAdapter: DeviceLogAdapter }) {
    super({name: "SdkInitialState", description: "Verify SDK disabled at startup", logAdapter: logAdapter});
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    this.eventEmitter.log("Execute SdkInitialState test");

    try {

      const logs = await this.logs()
      let testStatus = TestStatus.PASS;
      
      if(!logs.includes("onSdkStateChanged: RUNNING")){
        testStatus = TestStatus.FAIL;
        return {
          test: this.name,
          description: this.description,
          status: testStatus,
          error: "Unable to find SDK running log",
        }
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
