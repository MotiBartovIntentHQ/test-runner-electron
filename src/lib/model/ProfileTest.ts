interface TestProfile{
    platform: string,
    package_name: string;
    activity_name: string;
    automation_name: string;
    tests: Test[];
    quit_on_fail: boolean;
}

interface Test { 
    name: string;
    description: string;
    testPath: string;
    enabled: boolean;
    quit_on_fail: boolean
}