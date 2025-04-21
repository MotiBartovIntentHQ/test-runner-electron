import { Browser } from "webdriverio";

// ✅ Extend WebDriverIO's `Browser` interface
declare module "webdriverio" {
  interface Browser {
    getAppPackageName: () => Promise<String | null>;
  }
}

// ✅ Implement the `findTextElement` function
export async function getAppPackageName(this: WebdriverIO.Browser): Promise<String | null> {
    const capabilities = JSON.parse(JSON.stringify(this.capabilities));
    return capabilities["appPackage"];
}

export function extendBrowser(driver: WebdriverIO.Browser) {
    (driver as any).getAppPackageName = getAppPackageName.bind(driver);
  }
