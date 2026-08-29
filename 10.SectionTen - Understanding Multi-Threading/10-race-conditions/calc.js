const { workerData } = require("worker_threads");

const number = new Uint32Array(workerData.number);

for (let i = 0; i < 500_000; i++) {
  // This is our critical section
  number[0] = number[0] + 1;
}
