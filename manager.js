export default class Manager {
  targetTotalPointCount = 1e6;
  calculatedPointCount = 0;
  points = [];
  totalInCircleCount = 0;
  totalOutCircleCount = 0;
  calculatedPI = NaN;
  workers = [];
  updateListeners = [];
  completeListeners = [];
  workerCount = 1;
  startTime;
  endTime;
  p5;

  resetState() {
    this.calculatedPointCount = 0;
    this.points = [];
    this.totalInCircleCount = 0;
    this.totalOutCircleCount = 0;
    this.calculatedPI = NaN;
    this.startTime = NaN;
    this.endTime = NaN;

    this.removeAllWorkers();

    this.p5.draw();
  }


  getPointWorkLoads() {
    const pointWorkLoads = [];
    const averagePointWorkLoad = Math.trunc(this.targetTotalPointCount / this.workerCount);
    let pointCount = this.targetTotalPointCount;

    for (let i = 0; i < this.workerCount - 1; i++) {
      pointWorkLoads.push(averagePointWorkLoad);
      pointCount -= averagePointWorkLoad;
    }

    pointWorkLoads.push(pointCount);

    return pointWorkLoads;
  }

  start() {
    this.resetState();

    this.startTime = Date.now();

    for (let i = 0; i < this.workerCount; i++) {
      this.addNewWorker();
    }

    this.runAllWorkers();
  }

  workerMessageHandler = (e) => {
    console.log("completed...", e.data.points.length);

    this.calculatedPointCount += e.data.points.length;
    console.log("this.calculatedPointCount", this.calculatedPointCount);

    this.points = this.points.concat(e.data.points);

    this.totalInCircleCount += e.data.inCircleCount;
    this.totalOutCircleCount += e.data.outCircleCount;
    this.calculatePI();

    this.callAllUpdateListeners();

    if (this.targetTotalPointCount === this.calculatedPointCount) {
      this.callAllCompleteListeners();
      this.terminateAllWorkers();
    }
  }

  terminateAllWorkers() {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
  }

  addNewWorker() {
    const worker = new Worker("./worker.js");
    this.workers.push(worker);

    worker.onmessage = this.workerMessageHandler;
  }

  runWorker(worker, pointWorkLoad) {
    worker.postMessage({ pointWorkLoad });
  }

  runAllWorkers() {
    const pointWorkLoads = this.getPointWorkLoads();

    this.workers.forEach((worker, i) => this.runWorker(worker, pointWorkLoads[i]));
  }

  removeWorker() {
    const worker = this.workers.pop();
    worker.terminate();
  }

  removeAllWorkers() {
    while (this.workers.length) {
      this.removeWorker();
    }
  }

  calculatePI() {
    this.calculatedPI = 4 * this.totalInCircleCount / this.calculatedPointCount;
  }

  get pi() {
    return this.calculatedPI;
  }

  get error() {
    return Math.abs(this.pi - Math.PI);
  }

  get duration() {
    return (this.endTime - this.startTime) / 1000;
  }

  addOnUpdateListeners(func) {
    if (typeof func !== "function") throw new Error("invalid argument: func must be a function");

    this.updateListeners.push(func);
  }

  callAllUpdateListeners() {
    if (this.updateListeners.length === 0) return;

    this.updateListeners.forEach(func => func(this.state));
  }

  addOnCompleteListeners(func) {
    if (typeof func !== "function") throw new Error("invalid argument: func must be a function");

    this.completeListeners.push(func);
  }

  callAllCompleteListeners() {
    this.endTime = Date.now();

    if (this.completeListeners.length === 0) return;

    this.completeListeners.forEach(func => func(this.state));
  }

  get state() {
    return {
      targetTotalPointCount: this.targetTotalPointCount,
      calculatedPointCount: this.calculatedPointCount,
      points: this.points,
      pi: this.pi,
      error: this.error,
      duration: this.duration,
      workerCount: this.workerCount,
    };
  }

  increaseWorkerCount() {
    this.workerCount++;
  }

  decreaseWorkerCount() {
    if (this.workerCount > 0) this.workerCount--;
  }
}
