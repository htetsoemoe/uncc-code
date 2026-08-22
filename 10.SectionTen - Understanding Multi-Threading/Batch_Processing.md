### Why Keep the Main Thread Light in Node.js?

Node.js runs on a single-threaded event loop. If the main thread is busy doing heavy work—like running a massive `for` loop, allocating memory, or copying giant arrays—it **blocks the event loop**.

While the main thread is blocked:

* Incoming HTTP requests freeze or time out.
* Scheduled timers (`setTimeout`, `setInterval`) are delayed.
* Worker threads finish their jobs but their completion callbacks cannot execute because the main thread is trapped doing CPU work.

Keeping the main thread light ensures that Node.js remains responsive and acts efficiently as an orchestrator, while delegating heavy CPU computations to background worker threads.

---

### What is Batch Processing Here?

Rather than submitting all **10,000 tasks** to the worker pool at once (which floods memory and queues 10,000 callbacks immediately), **batch processing** splits the work into smaller chunks of **1,000 tasks** at a time.

```
Total Tasks (10,000)
 ├── Batch 1 (Tasks 0 – 999)    ──► Workers process ──► All done ──► Trigger next
 ├── Batch 2 (Tasks 1000 – 1999) ──► Workers process ──► All done ──► Trigger next
 ...
 └── Batch 10 (Tasks 9000 – 9999) ──► Final completion ──► Print results & exit

```

**Benefits of this Batch Pattern:**

1. **Memory Control:** Prevents allocating 10,000 task objects and closure callbacks in memory at once.
2. **Backpressure:** Controls the flow of incoming jobs so the task queue doesn't grow unbounded.
3. **Structured Execution:** Gives natural sync checkpoints where you can safely persist intermediate results (e.g., writing completed batches to disk and clearing memory).

---

### Code Explanation

#### 1. Setup & Workers

```javascript
const numWorkers = 4;
const pool = new Pool(numWorkers);

```

Initializes a worker pool with **4 background threads** (a major step up from 1 worker in the previous version, allowing true parallel CPU processing).

#### 2. Batch Parameters

```javascript
const totalTasks = 10_000;
const batchSize = 1_000;
let batchIndex = 0;

```

Defines that 10,000 total tasks will be processed in **10 distinct batches** of 1,000 tasks each ($10,000 / 1,000 = 10$).

#### 3. Batch Dispatcher (`submitNextBatch`)

```javascript
function submitNextBatch() {
  if (batchIndex * batchSize < totalTasks) {
    const startIndex = batchIndex * batchSize;
    const endIndex = Math.min((batchIndex + 1) * batchSize, totalTasks);
    submitBatch(startIndex, endIndex);
  }
}

```

Calculates array slice bounds (e.g., 0–1,000 for Batch 1, 1,000–2,000 for Batch 2) and triggers `submitBatch`.

#### 4. Task Submitter & Tracker (`submitBatch`)

```javascript
function submitBatch(startIndex, endIndex) {
  let batchTaskCount = 0;

  for (let i = startIndex; i < endIndex; i++) {
    batchTaskCount++; // Tracks active tasks in current batch

    pool.submit("generatePrimes", { ... }, (primes) => {
      tasksDone++;
      batchTaskCount--; // Decrements when worker completes one task

      result = result.concat(primes); // Appends output to main array

      if (tasksDone === totalTasks) {
        // All 10,000 tasks complete -> print total time & result
        process.exit(0);
      }

      if (batchTaskCount === 0) {
        // Current batch complete -> advance index & start next batch
        batchIndex++;
        submitNextBatch();
      }
    });
  }
}

```

* **Local Counter (`batchTaskCount`):** Tracked using closure state. Every time a worker returns results, `batchTaskCount` decrements.
* **Batch Advancement:** When `batchTaskCount === 0`, all 1,000 tasks in the active batch are complete. The script increments `batchIndex` and invokes `submitNextBatch()`.

---

### Key Observations & Performance Bottlenecks

| Feature / Issue | Impact | Recommendation |
| --- | --- | --- |
| **`result = result.concat(primes)`** | **High CPU / Main Thread Blocking** | `concat()` creates a full copy of `result` on every task completion. By task 10,000, `result` holds tens of thousands of items, causing severe main-thread lag. |
| **`batchTaskCount` Closure Tracking** | **Flow Control** | Ensures workers are not overwhelmed by queuing thousands of tasks ahead of time. |
| **`result.sort()`** | **Incorrect Sorting Behavior** | Without a comparator function, default `.sort()` sorts lexicographically (e.g., `100` before `2`). |