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
      
      let buttonFinder = byValueKey("setCustomMicroSegments")
      
      await driver.pause(1000);
      await driver.elementClick(buttonFinder);
      await driver.pause(2000);

      const logs = this.logs();
      let status = TestStatus.PASS;


      const userDefinedString = "onMethodCall: method: setUserDefinedString, arguments: {value=JedAI, key=Name}"
      const userDefinedInteger = "onMethodCall: method: setUserDefinedInteger, arguments: {value=35, key=Age}"
      const userDefinedDecimal = "onMethodCall: method: setUserDefinedDecimal, arguments: {value=777.0, key=Score}"

    if(!logs.includes(userDefinedString) || !logs.includes(userDefinedInteger) || !logs.includes(userDefinedDecimal)){
      status = TestStatus.FAIL
      return {
      test: this.name,
       description: this.description,
       status: status,
        error: "Unable to find plugin setUserDefiend APIs calls",
      };
    }

    const anagogApiUserDefinedString = "setUserDefinedString: Name, value: JedAI"
    const anagogApiUserDefinedInteger = "setUserDefinedInteger: Age value 35"
    const anagogApiUserDefinedDecimal = "setUserDefinedDecimal: Score value: 777.0"

      if(!logs.includes(anagogApiUserDefinedString) || !logs.includes(anagogApiUserDefinedInteger) || !logs.includes(anagogApiUserDefinedDecimal)){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Unable to find AnagogApi setUserDefined apis calls!",
        };
      }

      const databaseSetUserDefinedString = "database updated for Name stat, took"
      const databaseSetUserDefinedInteger = "database updated for Age stat, took"
      const databaseSetUserDefinedDecimal = "database updated for Score stat, took"

      if(!logs.includes(databaseSetUserDefinedString) || !logs.includes(databaseSetUserDefinedInteger) || !logs.includes(databaseSetUserDefinedDecimal)){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Unable to find userDefinedStats database update record",
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
  

