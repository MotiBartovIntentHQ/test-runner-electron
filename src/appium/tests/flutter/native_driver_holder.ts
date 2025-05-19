import { remote, Browser } from 'webdriverio';

export class NativeDriverHolder {
  private static instance: WebdriverIO.Browser| null = null;

  private constructor() {} // private constructor to prevent instantiation

  public static async getInstance(): Promise<WebdriverIO.Browser> {
    if (NativeDriverHolder.instance) {
      return NativeDriverHolder.instance;
    }

    console.log("🚀 Creating native Appium driver (UiAutomator2)...");

    const nativeCaps = {
        platformName: "Android",
        "appium:automationName": "UiAutomator2",
        "appium:deviceName": "emulator-5554",
        "appium:appPackage": `com.anagog.jema.flutter2.sampleapp`,
        "appium:appActivity": `.MainActivity`,
        "appium:noReset": true
      };

    NativeDriverHolder.instance = await createAndroidDriver(nativeCaps);

    
    return NativeDriverHolder.instance;
  }

  public static async destroy(): Promise<void> {
    if (NativeDriverHolder.instance) {
      await NativeDriverHolder.instance.deleteSession();
      NativeDriverHolder.instance = null;
      console.log("🧹 Native driver session destroyed.");
    }
  }
}

async function createAndroidDriver(capabilities: any) : Promise<WebdriverIO.Browser> {
    const driver = await remote({
         hostname: process.env.APPIUM_HOST || 'localhost',
         port: 4723,
         logLevel: 'info',
         capabilities,
       });
       return driver;
   }