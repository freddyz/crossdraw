const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("node:worker_threads");

const { drawFrame } = require("./drawAndSaveSingleFrame.js");

if (isMainThread) {
  console.log("this is the main thread");
} else {
  //const script = workerData;
  console.log("in subthread", { workerData });
  setTimeout(() => {
    parentPort.postMessage("jjj");
  }, 1000);
}
