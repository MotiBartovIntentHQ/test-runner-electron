import path from "path";
import fs from "fs";


interface ProfileTest { 
    name: string;
    description: string;
    testPath: string
}

export abstract class ProfileManager {
      abstract readTestProfile(driver: WebdriverIO.Browser): Promise<ProfileTest[]>;
}


export default class ProfileManagerImpl extends ProfileManager {
  testProfilePath;

  constructor(profilePath: string) {
    super();
    this.testProfilePath = profilePath;
  }

    async readTestProfile(): Promise<ProfileTest[]> {
        let testCases : ProfileTest[] = JSON.parse(fs.readFileSync(this.testProfilePath, "utf8"));
        return testCases;
    }
  
}