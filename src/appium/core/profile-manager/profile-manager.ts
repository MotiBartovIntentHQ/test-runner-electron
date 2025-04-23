import path from "path";
import fs  from "fs";



abstract class ProfileManager {
      abstract init(path: String) : void;
      abstract readTestProfile(): Promise<ProfileTest[]>;
}


  export class ProfileManagerImpl extends ProfileManager {
    private static instance: ProfileManager;

  private testProfilePath! : string;

 private constructor() {
    super();
  }

  public static getInstance(): ProfileManager {
    if (!ProfileManagerImpl.instance) {
      ProfileManagerImpl.instance = new ProfileManagerImpl();
    }
    return ProfileManagerImpl.instance;
  }

  public init(path: string){
    console.log("Profile Manager init")
    this.testProfilePath = path;
  }

  async readTestProfile(): Promise<ProfileTest[]> {
        let testCases : ProfileTest[] = JSON.parse(fs.readFileSync(this.testProfilePath, "utf8"));
        return testCases;
  }
}