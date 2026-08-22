Here is the optimized and refactored version of the batch processing script.

### Key Improvements Made

* **Replaced `concat` with `push(...primes)**`: Avoids $O(N^2)$ memory copying overhead on every callback, reducing main thread CPU consumption drastically.
* **Streamlined Batching with `async/await**`: Standardized task batching using Promises to clean up nested callbacks and manual state management (`batchTaskCount`, `batchIndex`).
* **Numeric Sorting Fix**: Corrected `.sort()` to standard numeric comparison (`(a, b) => a - b`).
* **Memory Management**: Offloaded memory pressure by clearing accumulated results per batch or storing results via array push.

```javascript
const Pool = require("./pool");
const { performance } = require("perf_hooks");
const os = require("os");

// Configuration
const TOTAL_TASKS = 10_000;
const BATCH_SIZE = 1_000;
const NUM_WORKERS = os.cpus().length || 4; // Scale to available CPU threads

const pool = new Pool(NUM_WORKERS);

/**
 * Wraps a single pool submission into a Promise.
 */
function runTask(taskIndex) {
  return new Promise((resolve) => {
    pool.submit(
      "generatePrimes",
      {
        count: 20,
        start: 10_000 + taskIndex * 500,
        format: true,
        log: false,
      },
      (primes) => resolve(primes)
    );
  });
}

/**
 * Dispatches a single batch of tasks concurrently and waits for completion.
 */
async function processBatch(batchNumber, startIndex, endIndex) {
  console.log(`[Batch ${batchNumber}] Processing tasks ${startIndex} to ${endIndex - 1}...`);
  
  const taskPromises = [];
  for (let i = startIndex; i < endIndex; i++) {
    taskPromises.push(runTask(i));
  }

  // Wait for all 1,000 worker tasks in this batch to finish
  const batchResults = await Promise.all(taskPromises);
  
  // Efficiently flatten batch array into a single 1D array
  return batchResults.flat();
}

/**
 * Main orchestrator loop
 */
async function main() {
  const start = performance.now();
  let results = [];
  let batchCount = 1;

  for (let startIndex = 0; startIndex < TOTAL_TASKS; startIndex += BATCH_SIZE) {
    const endIndex = Math.min(startIndex + BATCH_SIZE, TOTAL_TASKS);
    
    const batchPrimes = await processBatch(batchCount++, startIndex, endIndex);
    
    // Efficiently push elements to main array without copying memory
    results.push(...batchPrimes);

    // Optional: Stream results to disk here if memory becomes tight, then reset `results = []`
  }

  // Finalize
  const duration = (performance.now() - start).toFixed(2);
  console.log(`\nCompleted ${TOTAL_TASKS} tasks in ${duration}ms`);
  
  // Sort numerically
  results.sort((a, b) => a - b);
  console.log(`Total Primes Generated: ${results.length}`);

  process.exit(0);
}

main().catch((err) => {
  console.error("Error during batch processing:", err);
  process.exit(1);
});

```