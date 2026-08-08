const { Worker } = require("worker_threads");
const { performance } = require("perf_hooks");

// count: 200, start: 100_000_000_000_000, time: 30s, threads=1, numbers
// count: 200, start: 100_000_000_000_000, time: 8s, threads=4, numbers

// count: 20, start: 12n ** 17n, time: 22s, threads=1, Bigints
// count: 80, start: 12n ** 17n, time: 82s, threads=1, Bigints
// count: 80, start: 12n ** 17n, time: 20s, threads=8, Bigints

let result = [];
const THREADS = 2;
let completed = 0;
const count = 50; // number of prime numbers that we want
const start = performance.now();

for (let i = 0; i < THREADS; i++) {
    const worker = new Worker("./calc.js", {
        workerData: {
            count: count / THREADS,
            start: 100_000_000 + i * 100,
        },
    });
    const threadId = worker.threadId;
    console.log(`Worker ${threadId} started.`);

    worker.on("message", (primes) => {
        result = result.concat(primes);
    });

    worker.on("error", (err) => {
        console.error(err);
    });

    worker.on("exit", (code) => {
        console.log(`Worker ${threadId} exited.`);

        completed++;

        if (completed === THREADS) {
            console.log(`Time Taken: ${performance.now() - start}ms`);
            console.log(result.sort());
        }

        if (code !== 0) {
            console.error(`Worker ${threadId} exited with code ${code}`);
        }
    });
}

/**
Worker 1 started.
Worker 2 started.
Worker 2 exited.
Worker 1 exited.
Time Taken: 53.389869999999995ms
[
  '100,000,007', '100,000,037', '100,000,039',
  '100,000,049', '100,000,073', '100,000,081',
  '100,000,123', '100,000,123', '100,000,127',
  '100,000,127', '100,000,193', '100,000,193',
  '100,000,213', '100,000,213', '100,000,217',
  '100,000,217', '100,000,223', '100,000,223',
  '100,000,231', '100,000,231', '100,000,237',
  '100,000,237', '100,000,259', '100,000,259',
  '100,000,267', '100,000,267', '100,000,279',
  '100,000,279', '100,000,357', '100,000,357',
  '100,000,379', '100,000,379', '100,000,393',
  '100,000,393', '100,000,399', '100,000,399',
  '100,000,421', '100,000,421', '100,000,429',
  '100,000,429', '100,000,463', '100,000,463',
  '100,000,469', '100,000,469', '100,000,471',
  '100,000,493', '100,000,541', '100,000,543',
  '100,000,561', '100,000,567'
]
*/