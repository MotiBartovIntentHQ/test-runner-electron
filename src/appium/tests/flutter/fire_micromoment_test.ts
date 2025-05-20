import { log } from "console";
import { BaseTest, TestResult, TestStatus } from "../../core/base_test.js";
import {byValueKey} from "appium-flutter-finder";

export default class FireMicroMomentTest extends BaseTest {
  constructor() {
    super("FireMicroMomentTest", "Fire micromoment");
  }


  async execute(driver: WebdriverIO.Browser): Promise<TestResult> {
    this.eventEmitter.log("CustomMicroSegmentsTest");

    try {
      let buttonFinder = byValueKey("FireMicroMoment")
      let status = TestStatus.PASS;
 
      await driver.pause(1000);
      await driver.elementClick(buttonFinder);
      await driver.pause(1000);

      const logs = this.logs();

      const pluginFireMicroMomentPrompt = "onMethodCall: method: fireMicromoment, arguments: {identifier=cmm_redeposit_event, numericParameters={ConversionValue=40.0}, textParameters={}, booleanParameters={}}"
      const pluginMicroMomentApplicationEventPrompt = 'main INFO fireMicromoment: appEvent:';

    if(!logs.includes(pluginFireMicroMomentPrompt) || !logs.includes(pluginMicroMomentApplicationEventPrompt)){
      status = TestStatus.FAIL
      return {
      test: this.name,
       description: this.description,
       status: status,
        error: "Unable to find plugin fireMicromoment APIs calls",
      };
    }

    const microMomentIdentifierPrompt = `identifier='cmm_redeposit_event`;
    const microMomentNumericPrompt = `{ConversionValue=40.0}`

      if(!logs.includes(microMomentIdentifierPrompt) || !logs.includes(microMomentNumericPrompt)){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Unable to find AnagogApi microMomentEvent apis calls!",
        };
      }

      const lambdaApplicationEventPrompt = "about to run event[cmm_redeposit_event] in campaign"

    //   const databaseSetUserDefinedString = "get stats  by name: Name,result:"
    //   const databaseSetUserDefinedInteger = "get stats  by name: Age,result:"
    //   const databaseSetUserDefinedDecimal = "get stats  by name: Score,result:"

      if(!logs.includes(lambdaApplicationEventPrompt) ){
        status = TestStatus.FAIL
        return {
          test: this.name,
          description: this.description,
          status: status,
          error: "Unable to find lambda run event in campaign",
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
  

