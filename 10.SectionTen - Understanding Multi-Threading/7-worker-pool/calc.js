const { parentPort } = require("worker_threads");
const generatePrimes = require("./prime-generator");

parentPort.on("message", ({ taskName, options }) => {
  switch (taskName) {
    case "generatePrimes":
      const primes = generatePrimes(options.count, options.start, {
        format: options.format,
        log: options.log,
      });
      parentPort.postMessage(primes);
      break;
    default:
      parentPost.postMessage("Unknown task");
  }
});
