import { BaseTest, TestResult, TestStatus } from "../core/base_test.js";
import * as fs from "fs";

export default class SdkInitialState extends BaseTest {
  constructor() {
    super("SdkInitialState", "Verify SDK disabled at startup");
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    console.log("execute Test1");



    try {
      const currentDir = process.cwd();

      console.log(`SdkInitialState: currentDir ${currentDir}`)
      const logs: string = fs.readFileSync(`${currentDir}/logcat_dump.txt`, "utf8");
      let testStatus = TestStatus.PASS;
      
      if(!logs.includes("DISABLED") || logs.includes("SUSPENED")){
        testStatus = TestStatus.FAIL;
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
