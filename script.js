const scripts = [
  {
    name: "Build Package",
    description: "Compile assets and prepare the output folder.",
    duration: 900
  },
  {
    name: "Lint Sources",
    description: "Check formatting and common code issues.",
    duration: 720
  },
  {
    name: "Run Tests",
    description: "Execute the local test suite.",
    duration: 1100
  },
  {
    name: "Publish Report",
    description: "Generate a lightweight run summary.",
    duration: 840
  }
];

const scriptList = document.querySelector("#scriptList");
const activityLog = document.querySelector("#activityLog");
const readyCount = document.querySelector("#readyCount");
const successCount = document.querySelector("#successCount");
const runAllButton = document.querySelector("#runAll");
const clearLogButton = document.querySelector("#clearLog");

let successfulRuns = 12;

function addLog(scriptName, message) {
  const item = document.createElement("li");
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  item.innerHTML = `<strong>${scriptName}</strong> ${message} <span>${time}</span>`;
  activityLog.prepend(item);
}

function updateCounts() {
  const running = document.querySelectorAll(".run-button.is-running").length;
  readyCount.textContent = String(scripts.length - running);
  successCount.textContent = String(successfulRuns);
}

function runScript(button, script) {
  if (button.classList.contains("is-running")) {
    return Promise.resolve();
  }

  button.classList.add("is-running");
  button.textContent = "Running";
  updateCounts();
  addLog(script.name, "started.");

  return new Promise((resolve) => {
    window.setTimeout(() => {
      successfulRuns += 1;
      button.classList.remove("is-running");
      button.textContent = "Run";
      updateCounts();
      addLog(script.name, "finished successfully.");
      resolve();
    }, script.duration);
  });
}

function renderScripts() {
  scriptList.innerHTML = "";

  scripts.forEach((script) => {
    const row = document.createElement("article");
    row.className = "script-row";
    row.innerHTML = `
      <div>
        <h3>${script.name}</h3>
        <p>${script.description}</p>
      </div>
      <button class="run-button" type="button">Run</button>
    `;

    const button = row.querySelector("button");
    button.addEventListener("click", () => runScript(button, script));
    scriptList.append(row);
  });
}

runAllButton.addEventListener("click", async () => {
  const buttons = Array.from(document.querySelectorAll(".run-button"));
  runAllButton.disabled = true;
  runAllButton.textContent = "Running";

  await Promise.all(buttons.map((button, index) => runScript(button, scripts[index])));

  runAllButton.disabled = false;
  runAllButton.textContent = "Run All";
});

clearLogButton.addEventListener("click", () => {
  activityLog.innerHTML = "";
});

renderScripts();
addLog("Workspace", "is ready.");
