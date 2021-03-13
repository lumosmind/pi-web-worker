function updateUI(data) {
  const {
    targetTotalPointCount,
    calculatedPointCount,
    pi,
    error,
    workerCount,
    duration,
  } = data;

  updateCalculatedPiLabel(pi);
  updateErrorLabel(error);
  updateCalculatedPointCount(calculatedPointCount, targetTotalPointCount);
  updateWorkerCountLabel(workerCount);
  updateDurationLabel(duration);

  console.log("updated");
}

function updateCalculatedPointCount(completed, total) {
  const label = document.getElementById("lbl-point-count");
  const percentage = (100 / total) * completed;
  const labelText = `${completed}/${total} [${percentage}%]`;
  label.textContent = labelText;
}

function updateCalculatedPiLabel(value) {
  if (Number.isNaN(value)) value = "-";
  document.getElementById("lbl-pi").textContent = value;
}

function updateErrorLabel(value) {
  if (Number.isNaN(value)) value = "-";
  document.getElementById("lbl-error").textContent = value;
}

function updateWorkerCountLabel(value) {
  document.getElementById("lbl-count").textContent = value;
}

function updateDurationLabel(value) {
  let labelText;
  if (Number.isNaN(value)) {
    labelText = "-";
  } else {
    labelText = value + "s";
  }
  document.getElementById("lbl-duration").textContent = labelText;
}

function btnAddHandler(manager) {
  manager.increaseWorkerCount();
  updateWorkerCountLabel(manager.state.workerCount);
}

function btnRemoveHandler(manager) {
  if (manager.state.workerCount.length === 0) return;

  manager.decreaseWorkerCount();
  updateWorkerCountLabel(manager.state.workerCount);
}

function btnStartHandler(manager) {
  manager.start();
  updateUI(manager.state);
  disableUI();
  setApplicationStatus("running simulation...");
}

function addEventListeners(manager) {
  const { btnAdd, btnRemove, btnStart } = getButtons();

  btnAdd.addEventListener("click", () => btnAddHandler(manager));

  btnRemove.addEventListener("click", () => btnRemoveHandler(manager));

  btnStart.addEventListener("click", () => btnStartHandler(manager));
}

function getButtons() {
  const btnAdd = document.getElementById("btn-add");
  const btnRemove = document.getElementById("btn-remove");
  const btnStart = document.getElementById("btn-start");

  return {
    btnAdd,
    btnRemove,
    btnStart,
  };
}

function disableUI() {
  Object.values(getButtons()).forEach((button) => (button.disabled = true));
}

function enableUI() {
  Object.values(getButtons()).forEach((button) => (button.disabled = false));
}

function setApplicationStatus(status) {
  const btnStart = document.getElementById("btn-start");

  if (status == "ready") {
    btnStart.textContent = "Start";
  } else {
    btnStart.textContent = status;
  }
}

export { addEventListeners, updateUI, enableUI, setApplicationStatus };
