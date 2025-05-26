import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";
import {byValueKey} from "appium-flutter-finder";

export default class CustomMicroSegmentsTest extends BaseTest {
  constructor() {
    super("CustomMicroSegmentsTest", "Set and get custom microsegments");
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    this.eventEmitter.log("CustomMicroSegmentsTest");

    try {
      const currentDir = process.cwd();
      
      let buttonFinder = byValueKey("showUserMicrosegments")
      
      await driver.pause(1000);
      await driver.elementClick(buttonFinder);
      await driver.pause(5000);

      const logs = this.logs();
      let status = TestStatus.PASS;


      let alertDialogOK = byValueKey("AlertDialogOK")

      await driver.elementClick(alertDialogOK)

      const getDefinedString = "onMethodCall: method: getUserDefinedString, arguments: Name"
      const getDefinedInteger = "onMethodCall: method: getUserDefinedInteger, arguments: Age"
      const getDefinedDecimal = "onMethodCall: method: getUserDefinedDecimal, arguments: Score"

    if(!logs.includes(getDefinedString) || !logs.includes(getDefinedInteger) || !logs.includes(getDefinedDecimal)){
      status = TestStatus.FAIL
      return {
      test: this.name,
       description: this.description,
       status: status,
        error: "Unable to find plugin getUserDefined APIs calls",
      };
    }

    const anagogApiUserDefinedString = "getUserDefinedString: Name"
    const anagogApiUserDefinedInteger = "getUserDefinedInteger: Age"
    const anagogApiUserDefinedDecimal = "getUserDefinedDecimal: Score"

      if(!logs.includes(anagogApiUserDefinedString) || !logs.includes(anagogApiUserDefinedInteger) || !logs.includes(anagogApiUserDefinedDecimal)){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Unable to find AnagogApi setUserDefined apis calls!",
        };
      }

      const databaseSetUserDefinedString = "get stats  by name: Name,result:"
      const databaseSetUserDefinedInteger = "get stats  by name: Age,result:"
      const databaseSetUserDefinedDecimal = "get stats  by name: Score,result:"

      if(!logs.includes(databaseSetUserDefinedString) || !logs.includes(databaseSetUserDefinedInteger) || !logs.includes(databaseSetUserDefinedDecimal)){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Unable to find userDefinedStats database update record",
        };
      }
    
      const facadeResultUserDefinedString = "AnagogApiThread INFO AnagogActiveImpl::getUserDefinedString result JedAI"
      const facadeResultUserDefinedInteger = "AnagogApiThread INFO AnagogActiveImpl::getUserDefinedInteger result 35"
      const facadeResultUserDefinedDecimal = "AnagogApiThread INFO AnagogActiveImpl::getUserDefinedDecimal result 777.0"

      if(!logs.includes(facadeResultUserDefinedString) || !logs.includes(facadeResultUserDefinedInteger) || !logs.includes(facadeResultUserDefinedDecimal)){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Unable to find facadeResultUserDefined results record",
        };
      }

      return {
        test: this.name,
        description: this.description,
        status: TestStatus.PASS,
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

  async scrollToButton(driver: WebdriverIO.Browser) {
    await driver.execute('flutter:scrollIntoView', byValueKey('ScheduleReports'), {alignment: 0.1})
    let buttonFinder = byValueKey("ScheduleReports")

  await driver.elementClick(buttonFinder);
  }
}
  

