

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

  let profilePath = "";
  let apkPath = "";

  profileInput.onclick = async () => {
    consoleOutput.textContent += `🚀 addEventListener: click\n`;

    const paths = await (window as any).electronApi.openFileDialog();
    console.log("Selected path:", paths[0]);

    profilePath = paths[0] || "";
    profileFileName.textContent = profilePath;
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
    apkFileName.textContent = apkPath;
    consoleOutput.textContent += `🚀 apk selected: ${apkPath} \n`;

    updateButtonState();
  };

  function updateButtonState() {
    runBtn.disabled = !(profilePath && apkPath);
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
    let testCases : ProfileTest[] = JSON.parse(content)
    // let tests = await profileManager.readTestProfile()
   console.log(`Loaded tests: ${JSON.stringify(testCases)}`);
   const itemList = document.getElementById("testsList")!;
   if(testCases.length > 0){
    itemList.innerHTML = "";
    testCases.filter(item => item.enabled == true).forEach((item: ProfileTest, index: number) => {
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

  async function iterateList() {
    const itemList = document.getElementById("testsList")!;
    const items = itemList.querySelectorAll<HTMLLIElement>("li");

    for(let index = 0; index < items.length; index++) {
      updateTestStatus(index, "running")
      await delay(1000);
      if(index % 3 === 0){
        updateTestStatus(index, "passed")
      } else {
        updateTestStatus(index, "failed")
      }
    }
  }


  function updateTestStatus(index: number, status: string){
    const li = document.getElementById(`test-${index}`);

    if(!li){
      return;
    }
    const icon = li.querySelector<HTMLSpanElement>(".icon");

    if(status === "running"){ 
      li.classList.add("selected");
    } else {
      li.classList.remove("selected");
    }

    if(!icon){
      return;
    } 

    if(status !== "running"){
      if(status === "PASS"){
        icon.textContent = "✅";
      } else {
        icon.textContent = "❌";
      }
    } 
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
        case "log" : consoleOutput.textContent += msg.content;
        break;
        case "error": consoleOutput.textContent += msg.content;
      }
    } else {
      consoleOutput.textContent += msg + "\n";
    }
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  });
  
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




