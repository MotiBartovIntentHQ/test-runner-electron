

export  const  swipeAndroidApp = async (driver: WebdriverIO.Browser) => {
    await driver.pressKeyCode(187); // KEYCODE_APP_SWITCH
    await driver.pause(1000); 
    await driver.performActions([
        {
          type: "pointer",
          id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            { type: "pointerMove", duration: 0, x: 500, y: 1000 }, // Start point
            { type: "pointerDown", button: 0 },
            { type: "pause", duration: 200 },
            { type: "pointerMove", duration: 300, x: 500, y: 0 }, // Swipe up
            { type: "pointerUp", button: 0 }
          ]
        }
      ]);
      await driver.releaseActions();
      await driver.pause(1000); 
      await driver.pressKeyCode(3);  //Press the home button
}
