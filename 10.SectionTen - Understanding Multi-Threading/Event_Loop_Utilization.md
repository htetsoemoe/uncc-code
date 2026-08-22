This Node.js script benchmarks offloading heavy CPU tasks to a worker pool rather than running them on the main thread.

Here is a step-by-step breakdown of how the code operates and key features to note:

### 1. Imports and Pool Initialization

```javascript
const Pool = require("./pool");
const { performance } = require("perf_hooks");

const numWorkers = 1;
const pool = new Pool(numWorkers);

```

* **Worker Pool:** Imports a custom `Pool` module and instantiates it with a thread pool size of `1`.
* **Performance Hook:** Imports `performance` from Node's `perf_hooks` module to measure timing and CPU utilization metrics.

---

### 2. State & Task Configuration

```javascript
let result = [];
let tasksDone = 0;
const totalTasks = 200;
const start = performance.now();

```

* **Tracking State:** Defines an array (`result`) to collect returned prime numbers, a task completion counter (`tasksDone`), and a total task count (`totalTasks = 200`).
* **Timer:** Starts a high-resolution timer (`performance.now()`) to measure total execution time.

---

### 3. Task Dispatching

```javascript
for (let i = 0; i < totalTasks; i++) {
  pool.submit(
    "generatePrimes",
    {
      count: 20,
      start: 1_000_000_000 + i * 500,
      format: true,
      log: false,
    },
    (primes) => { ... }
  );
}

```

* **`pool.submit()` Loop:** Submits 200 separate requests to the worker pool without blocking the main event loop.
* **Task Payload:** Each task asks a worker thread to run a function named `"generatePrimes"` to find 20 prime numbers starting from increasing numerical offsets (`1,000,000,000`, `1,000,000,500`, etc.).
* **Callback:** Passes a completion handler function that runs on the main thread every time a worker thread completes a task.

---

### 4. Callback Processing & Termination

```javascript
console.log(performance.eventLoopUtilization());

tasksDone++;
result = result.concat(primes);

if (tasksDone === totalTasks) {
  console.log(`Time taken: ${performance.now() - start}ms`);
  console.log(result.sort());
  process.exit(0);
}

```

* **Event Loop Monitoring:** Logs `performance.eventLoopUtilization()`, which measures how active or idle the Node.js main thread event loop was during task execution.
* **Aggregating Results:** Increments `tasksDone` and appends the worker's returned `primes` array into `result`.
* **Finalizing:** Once all 200 tasks finish, it logs the elapsed duration in milliseconds, outputs the sorted list of prime numbers, and terminates the script cleanly using `process.exit(0)`.

---

### Key Takeaways & Potential Pitfalls

* **Single Worker Bottleneck:** Setting `numWorkers = 1` limits parallelism. To speed up computation on multi-core systems, increase `numWorkers` to match available CPU cores (e.g., `os.cpus().length`).
* **Array Concatenation Overhead:** Using `result = result.concat(primes)` creates a shallow copy of the entire array on every callback, resulting in $O(N^2)$ array allocation overhead. `result.push(...primes)` is significantly more efficient.
* **Sorting Bugs:** `result.sort()` sorts elements as **strings** by default (e.g., `[10, 100, 2]`). For numeric sorting, pass a comparison function: `result.sort((a, b) => a - b)`.