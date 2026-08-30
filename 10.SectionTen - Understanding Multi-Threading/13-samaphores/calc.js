const { workerData } = require("worker_threads");

const number = new Uint32Array(workerData.number);
const seal = new Int32Array(workerData.seal);

function lock(seal) {
  // If seal is 0, stores 1 to it. Always returns the old value.
  while (Atomics.compareExchange(seal, 0, 0, 1) === 1) {
    Atomics.wait(seal, 0, 1); // If seal is 1, stop the execution
  }
}

function unlock(seal) {
  Atomics.store(seal, 0, 0); // unseal (set the seal back to 0)
  Atomics.notify(seal, 0, 1); // wake up one suspended thread
}

for (let i = 0; i < 10_000_000; i++) {
  lock(seal);
  
  // This is our critical section
  number[0] = number[0] + 1;

  unlock(seal);
}
