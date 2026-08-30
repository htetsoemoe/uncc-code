# Worker Pool, Shared Memory, Lock, and Unlock

This folder demonstrates a worker pool that uses shared memory and atomic operations.

The main idea is:

```text
Main thread creates a pool of workers.
Tasks are submitted to the pool.
Workers process tasks in parallel.
Large results are written into shared memory.
Atomic lock and unlock functions protect shared memory writes.
```

## Files in This Example

- `app.js`: creates the pool, submits many tasks, and tracks progress.
- `pool.js`: manages workers, idle threads, queued tasks, and shared memory.
- `calc.js`: runs inside each worker and performs the requested task.
- `factorial.js`: calculates factorial values using `BigInt`.
- `prime-generator.js`: generates prime numbers.

## Worker Pool

A worker pool is a group of worker threads that are created once and reused for many tasks.

Instead of creating a new worker for every task, the program keeps a fixed number of workers alive. This reduces overhead and gives the program better control over parallel work.

In `app.js`, the number of workers is set to four:

```js
const numWorkers = 4;
```

Then a pool is created:

```js
const pool = new Pool(numWorkers, totalTasks * count);
```

The pool receives:

- `numWorkers`: how many worker threads to create
- `totalTasks * count`: how many shared memory slots to prepare

## Task Submission

`app.js` submits many `generateNumbers` tasks:

```js
pool.submit(
  "generateNumbers",
  {
    count,
    start: 10_000_000_000n + BigInt(i * 5000),
  },
  async (result) => {
    // callback when task finishes
  }
);
```

Each submitted task has:

- a task name
- task options
- a callback function

The callback runs when the worker sends a message back to the pool.

## How `pool.js` Manages Workers

The `Pool` class stores three important arrays:

```js
this.threads = [];
this.idleThreads = [];
this.scheduledTasks = [];
```

They mean:

- `threads`: all workers created by the pool
- `idleThreads`: workers that are available for new work
- `scheduledTasks`: tasks waiting for an available worker

When the pool starts, it creates the workers:

```js
for (let i = 0; i < threadCount; i++) {
  this.spawnThread();
}
```

Each worker runs `calc.js`:

```js
const worker = new Worker(path.join(__dirname, "calc.js"), {
  workerData: {
    numbers: this.numbers,
    numbersSeal: this.numbersSeal,
    primes: this.primes,
    primesSeal: this.primesSeal,
  },
});
```

The pool passes shared memory buffers to every worker.

## Shared Memory Buffers

In `pool.js`, shared memory is created with `SharedArrayBuffer`:

```js
this.primes = new SharedArrayBuffer((totalItemsCount * 64) / 8);
this.primesSeal = new SharedArrayBuffer(4);
this.numbers = new SharedArrayBuffer((totalItemsCount * 64) / 8);
this.numbersSeal = new SharedArrayBuffer(4);
```

There are two large shared buffers:

- `primes`: stores generated prime numbers
- `numbers`: stores generated numbers

There are also two small shared buffers:

- `primesSeal`: lock for the `primes` buffer
- `numbersSeal`: lock for the `numbers` buffer

The word `seal` is used like a lock flag:

```text
0 means unlocked
1 means locked
```

## Receiving Shared Memory in `calc.js`

Inside `calc.js`, the worker converts the shared buffers into typed arrays:

```js
const primes = new BigUint64Array(workerData.primes);
const primesSeal = new Int32Array(workerData.primesSeal);
const numbers = new BigUint64Array(workerData.numbers);
const numbersSeal = new Int32Array(workerData.numbersSeal);
```

The large result buffers use `BigUint64Array` because the program stores large integer values.

The lock buffers use `Int32Array` because `Atomics.wait` works with integer typed arrays such as `Int32Array`.

## Why a Lock Is Needed

Multiple workers can finish tasks at the same time.

When a worker finishes generating numbers, it writes them into the shared `numbers` buffer:

```js
numbers.set(generatedNumbers, numbers.indexOf(0n));
```

When a worker finishes generating primes, it writes them into the shared `primes` buffer:

```js
primes.set(generatedPrimes, primes.indexOf(0n));
```

These writes must be protected.

Without a lock, two workers could both find the same first empty position with `indexOf(0n)` and then write into the same place. That would overwrite data or produce missing results.

The lock makes sure only one worker writes to a shared buffer at a time.

## Atomic Lock

The lock function is defined in `calc.js`:

```js
function lock(seal) {
  // If seal is 0, stores 1 to it. Always returns the old value
  while (Atomics.compareExchange(seal, 0, 0, 1) !== 0) {
    Atomics.wait(seal, 0, 1); // if seal is 1, stop the execution
  }
}
```

This function receives a `seal`, which is an `Int32Array` wrapping a small shared buffer.

The important operation is:

```js
Atomics.compareExchange(seal, 0, 0, 1)
```

This means:

```text
At seal[0], if the current value is 0, replace it with 1.
Return the old value.
```

So:

- if the old value was `0`, the worker successfully changed it to `1` and now owns the lock
- if the old value was `1`, another worker already owns the lock

The `while` loop keeps trying until the worker gets the lock.

When the lock is already taken, this line runs:

```js
Atomics.wait(seal, 0, 1);
```

That means:

```text
If seal[0] is 1, put this worker to sleep.
```

This is better than constantly checking in a busy loop because the waiting worker can pause until it is notified.

## Atomic Unlock

The unlock function is also defined in `calc.js`:

```js
function unlock(seal) {
  Atomics.store(seal, 0, 0); // unseal (set the seal to 0)
  Atomics.notify(seal, 0, 20);
}
```

This line releases the lock:

```js
Atomics.store(seal, 0, 0);
```

It changes `seal[0]` back to `0`, meaning the shared buffer is unlocked.

Then this line wakes waiting workers:

```js
Atomics.notify(seal, 0, 20);
```

This tells JavaScript to wake up to 20 workers waiting on `seal[0]`.

After workers wake up, they try `Atomics.compareExchange` again. Only one of them will successfully change the seal from `0` to `1`. That worker gets the lock. The others go back to waiting if the seal is already `1`.

## Lock and Unlock Around Shared Writes

For prime generation, `calc.js` uses:

```js
lock(primesSeal);
primes.set(generatedPrimes, primes.indexOf(0n));
unlock(primesSeal);
```

For number generation, it uses:

```js
lock(numbersSeal);
numbers.set(generatedNumbers, numbers.indexOf(0n));
unlock(numbersSeal);
```

This pattern protects the critical section.

The critical section is the part where shared memory is accessed and modified:

```js
numbers.set(generatedNumbers, numbers.indexOf(0n));
```

Only one worker should execute that shared write at a time.

## Task Flow

The full task flow looks like this:

```text
app.js submits a task
pool.js stores the task in scheduledTasks
pool.js finds an idle worker
pool.js sends the task to calc.js
calc.js performs the work
calc.js locks the shared buffer
calc.js writes the result into shared memory
calc.js unlocks the shared buffer
calc.js sends "done" back to pool.js
pool.js marks the worker as idle
pool.js runs the next queued task
```

## Getting Results

The pool reads the shared memory with:

```js
getNumbers() {
  return Array.from(new BigUint64Array(this.numbers).sort());
}
```

and:

```js
getPrimes() {
  return Array.from(new BigUint64Array(this.primes).sort());
}
```

These methods convert the shared buffers into arrays and sort the results.

## Summary

This example combines three important multithreading ideas:

- Worker pool: reuse a fixed number of workers for many tasks.
- Shared memory: use `SharedArrayBuffer` so workers can write results into common memory.
- Atomic lock and unlock: use `Atomics.compareExchange`, `Atomics.wait`, `Atomics.store`, and `Atomics.notify` to protect shared writes.

The lock prevents race conditions when multiple workers finish at the same time. Without it, workers could write into the same shared memory positions and corrupt the final result.

The most important pattern is:

```js
lock(sharedSeal);
// modify shared memory here
unlock(sharedSeal);
```

That pattern keeps the shared memory update safe.
