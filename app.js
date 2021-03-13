import Manager from "./manager.js";
import myP5 from "./draw.js";
import { addEventListeners, updateUI, enableUI, setApplicationStatus } from "./view.js";
console.log(myP5);

const manager = new Manager();
manager.p5 = myP5;
console.log(manager);

addEventListeners(manager);
updateUI(manager.state);

manager.addOnUpdateListeners(updateUI);

manager.addOnCompleteListeners(function (data) {
  const { points } = data;
  // enableUI();
  setApplicationStatus("drawing graph...");

  console.log("Completed");

  updateUI(manager.state);
  const frameCount = 10;

  for (let i = 0; i < frameCount; i++) {
    const start = i * points.length / frameCount;
    let end = start + points.length / frameCount;
    if (i === frameCount - 1) end = -1;

    setTimeout(() => {
      myP5.drawAllPoints(points.slice(start, end));
      if (end === -1) {
        setApplicationStatus("ready");
        enableUI();
      }
    }, 60);
  }

});


