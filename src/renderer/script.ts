

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
    consoleOutput.textContent = "🚀 Running tests...\n";
    const result = await (window as any).electronApi.runTests(profilePath, apkPath);
    consoleOutput.textContent += result;
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
    testCases.filter(item => item.enabled == true).forEach((item: ProfileTest) => {
      const li = document.createElement("li");
      li.textContent = item.name;
      // li.style.border = "2px inset #ccc";
      // li.style.marginBottom = "0.5rem";
      // li.style.padding = "0.5rem";
      // li.style.cursor = "pointer";
  
      li.addEventListener("click", () => {
        console.log(`🧪 Selected test: ${item.name}`);
        // You can fire off logic here like loading test info or running it
      });
  
      itemList.appendChild(li);
    });    
   }


  }
});

async function loadPartial(id: string, file: string) {
  const response = await fetch(file);
  const html = await response.text();
  const container = document.getElementById(id);
  if (container) container.innerHTML = html;
}




