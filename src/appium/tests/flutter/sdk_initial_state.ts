import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";

export default class SdkInitialState extends BaseTest {
  constructor() {
    super("SdkInitialState", "Verify SDK disabled at startup");
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    this.eventEmitter.log("Execute SdkInitialState test");

    try {

      const logs = this.logs()
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
