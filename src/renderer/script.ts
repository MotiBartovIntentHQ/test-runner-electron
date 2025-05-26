

// profileInput.onchange = async () => {
//   const name = profileInput.files?.[0]?.name || "No profile selected";
//   profileFileName.textContent = name;
//   consoleOutput.textContent += `🚀 profile selected: ${name}\n `;
//   updateButtonState();
// };


window.addEventListener("DOMContentLoaded", async () => {
  await loadPartial("head", "./head.html")
  await loadPartial("content", "./tester_content.html");


  const profileInput = document.getElementById("profileInput") as HTMLInputElement;
  const profileFileName = document.getElementById("profileFileName") as HTMLInputElement;

  const apkInput = document.getElementById("apkInput") as HTMLInputElement;
  const apkFileName = document.getElementById("apkFileName") as HTMLInputElement;

  const runBtn = document.getElementById("runBtn") as HTMLButtonElement;
  const consoleOutput = document.getElementById("consoleOutput")!;
  const statusIndicator = document.getElementById("test-stauts-container") as HTMLInputElement;
  const statusIndicatorText = document.getElementById("test-status-continer-text") as HTMLInputElement;
  const terminal = document.getElementById("terminal") as HTMLInputElement;

  let profilePath = "";
  let apkPath = "";

  let testing = false;

  profileInput.onclick = async () => {
    consoleOutput.textContent += `🚀 addEventListener: click\n`;

    const paths = await (window as any).electronApi.openFileDialog();
    console.log("Selected path:", paths[0]);

    profilePath = paths[0] || "";
    profileFileName.textContent =  profilePath.substring(profilePath.lastIndexOf("/") + 1) ;
    consoleOutput.textContent += `🚀 profile selected: ${JSON.stringify(profilePath)}\n`;
    if(profilePath != null) {
      readTestFromJson(profilePath);
      updateButtonState();
    }
    
  }
  
  apkInput.onclick = async () => {
    const paths = await (window as any).electronApi.openFileDialog();
    console.log("Selected path:", paths[0]);
  
    apkPath = paths[0] || "";
    apkFileName.textContent = apkPath.substring(apkPath.lastIndexOf("/") + 1);
    consoleOutput.textContent += `🚀 apk selected: ${apkPath} \n`;

    updateButtonState();
  };

  function updateButtonState() {
    runBtn.disabled = !(profilePath && apkPath) || testing;
  }

  runBtn.onclick = async () => {
    consoleOutput.textContent = "";
    consoleOutput.textContent = "🚀 Running tests...\n";
    const result = await (window as any).electronApi.runTests(profilePath, apkPath);
    consoleOutput.textContent += result;

    // iterateList();
  };


  async function  readTestFromJson(path: string)  {
    console.log(`readTestFromJson path: ${path}`)
    const content = await (window as any).electronApi.readFile(path);
    let testProfile : TestProfile = JSON.parse(content)
    // let tests = await profileManager.readTestProfile()
   console.log(`Loaded tests: ${JSON.stringify(testProfile)}`);
   const itemList = document.getElementById("testsList")!;
   const testCases = testProfile.tests;
   if(testProfile.tests.length > 0){
    itemList.innerHTML = "";
    testCases.filter(item => item.enabled == true).forEach((item: Test, index: number) => {
      const li = document.createElement("li");
      li.id = `test-${index}`;
      li.classList.add("list-item")
    
      const textNode = document.createTextNode(item.name)
    
      const icon = document.createElement("span");
      icon.classList.add("icon");
      icon.textContent = ""; // You can also use an SVG or emoji

 // Append the text and the icon into the <li>
      li.appendChild(textNode);
      li.appendChild(icon);  
      li.addEventListener("click", () => {
        console.log(`🧪 Selected test: ${item.name}`);
        
        // You can fire off logic here like loading test info or running it
      });

      
  
      itemList.appendChild(li);
    });    
   }
  }

  function updateTestStatus(index: number, status: string){
    const li = document.getElementById(`test-${index}`);

    if(!li){
      return;
    }
    const icon = li.querySelector<HTMLSpanElement>(".icon");

    if(!icon){
      return;
    } 
    
    if(status === "running"){ 
      icon.textContent = "⏳";
      li.classList.add("selected");
    } else {
      li.classList.remove("selected");
      if(status === "PASS"){
        icon.textContent = "✅";
      } else {
        icon.textContent = "❌";
      }
    } 
    }

  function updateTestResult(status: string){
   if(status === "PASSED") {
    statusIndicator.style.backgroundColor = "#0add3b";
    statusIndicatorText.textContent = "PASSED 🙂"
   } else if(status === "FAILED"){
    statusIndicator.style.backgroundColor = "#e20d0d";
    statusIndicatorText.textContent = "FAILED 🙁"
   }
   testing = false;
   updateButtonState();
  }

  function clearTestsList(){
    const itemList = document.getElementById("testsList")!;
    const items = itemList.querySelectorAll<HTMLLIElement>("li");
    for(let index = 0; index < items.length; index++) {
      const li = document.getElementById(`test-${index}`);
      const icon = li?.querySelector<HTMLSpanElement>(".icon");
      li?.classList.remove("selected");
      icon!.textContent = "";
    }
  }

  function clearConsole(){
    consoleOutput.textContent = "";
  }

  function startTesting(){
    clearTestsList();
    clearConsole()
    statusIndicator.style.backgroundColor = "#e4cb12";
    statusIndicatorText.textContent = "RUNNING ⏳"
    testing = true;
    updateButtonState()
  }

  function startAppium(window : any){
    (window as any).electronApi.startAppium((msg : any) => {
      terminal.textContent += msg;
    });
  }

  (window as any).electronApi.onProcessUpdate((msg: any) => {
    if(typeof msg === "object"){
      switch(msg.type){
        case "start": startTesting();
        break;
        case "test-start": updateTestStatus(msg.index, "running");
        break;
        case "test-stop" : updateTestStatus(msg.index, msg.status.toString());
        break;
        case "test-result" : updateTestResult(msg.status);
        break;
        case "log" : consoleOutput.textContent += msg.content + "\n";
        break;
        case "error": consoleOutput.textContent += msg.content + "\n";
      }
    } else {
      consoleOutput.textContent += `ProcessUpdate: ${msg}` + "\n";
    }
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  });
  

  (window as any).electronApi.appiumUpdates((msg: any) => {  
    terminal.innerHTML += msg;
    terminal.scrollTop = terminal.scrollHeight;
  });
  
  startAppium(window);
});

async function loadPartial(id: string, file: string) {
  const response = await fetch(file);
  const html = await response.text();
  const container = document.getElementById(id);
  if (container) container.innerHTML = html;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}





