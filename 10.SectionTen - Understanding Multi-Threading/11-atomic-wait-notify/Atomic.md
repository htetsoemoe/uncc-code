# JavaScript Atomics

JavaScript `Atomics` is a built-in object used with `SharedArrayBuffer` to safely coordinate work between multiple threads.

In Node.js, worker threads can share memory by using `SharedArrayBuffer`. When multiple workers read or write that shared memory, normal operations can cause race conditions. `Atomics` provides special operations that happen safely and predictably across workers.

## Shared Memory in This Example

In `app.js`, a shared buffer is created:

```js
const flag = new Int32Array(new SharedArrayBuffer(4));
```

This creates one shared 32-bit integer. The `4` means 4 bytes, which is the size of one `Int32` value.

The shared memory is wrapped in an `Int32Array` because `Atomics.wait` only works with integer typed arrays such as `Int32Array` or `BigInt64Array`.

Then `app.js` starts eight worker threads:

```js
for (let i = 0; i < 8; i++) {
  new Worker("./calc.js", { workerData: { flag: flag.buffer } });
}
```

Each worker receives the same shared buffer:

```js
workerData: { flag: flag.buffer }
```

That means every worker can access the same memory location.

## Worker Code in `calc.js`

In `calc.js`, the worker rebuilds the shared typed array:

```js
const flag = new Int32Array(workerData.flag);
```

Now the worker has access to the same shared `flag` value created in `app.js`.

The worker then runs an infinite loop:

```js
while (true) {
  i++;

  if (i === 1000) {
    Atomics.wait(flag, 0, 0);
  }
}
```

When `i` reaches `1000`, the worker calls:

```js
Atomics.wait(flag, 0, 0);
```

This tells the worker:

```text
Wait while flag[0] is equal to 0.
```

The arguments mean:

- `flag`: the shared typed array
- `0`: the index to check, so `flag[0]`
- `0`: the expected value

If `flag[0]` is still `0`, the worker goes to sleep and stops running until it is notified or until the wait ends for another reason.

## `Atomics.notify`

In `app.js`, this code runs after 3 seconds:

```js
setTimeout(() => {
  Atomics.notify(flag, 0, 4);
}, 3000);
```

This wakes workers that are waiting on `flag[0]`.

The arguments mean:

- `flag`: the shared typed array
- `0`: the index where workers are waiting
- `4`: the maximum number of workers to wake

Since the program starts eight workers but calls `Atomics.notify(flag, 0, 4)`, only up to four waiting workers are notified.

The remaining workers can stay blocked because they were also waiting on `flag[0]`, but they were not included in the notify count.

## Important Detail About the Flag Value

This example calls `Atomics.notify`, but it does not change the value of `flag[0]`.

The value starts as `0`:

```js
const flag = new Int32Array(new SharedArrayBuffer(4));
```

Typed arrays are initialized with zeroes, so `flag[0]` is initially `0`.

A common pattern is to update the shared value first, then notify workers:

```js
Atomics.store(flag, 0, 1);
Atomics.notify(flag, 0);
```

That means:

1. Store `1` in `flag[0]`.
2. Wake the workers waiting on `flag[0]`.

Without changing the flag value, a worker may wake up but still find the shared value unchanged.

## Why Use Atomics?

`Atomics` helps with safe communication between workers.

It can be used to:

- Read shared memory safely
- Write shared memory safely
- Add, subtract, or exchange values atomically
- Put workers to sleep with `Atomics.wait`
- Wake workers with `Atomics.notify`

For example, an atomic increment can be written as:

```js
Atomics.add(sharedArray, 0, 1);
```

This avoids the race condition caused by normal code like:

```js
sharedArray[0] = sharedArray[0] + 1;
```

The normal version reads, adds, and writes as separate steps. Another worker can interrupt between those steps. `Atomics.add` performs the update as one safe atomic operation.

## Summary

The files in this folder demonstrate JavaScript atomic coordination:

- `app.js` creates shared memory using `SharedArrayBuffer`.
- `app.js` starts eight worker threads.
- `calc.js` receives the shared memory.
- `calc.js` uses `Atomics.wait(flag, 0, 0)` to pause workers.
- `app.js` uses `Atomics.notify(flag, 0, 4)` to wake up to four workers.

The main idea is that `Atomics` gives worker threads a safe way to communicate through shared memory. It prevents unsafe timing problems and also provides wait/notify behavior, which lets workers sleep instead of wasting CPU while they wait.
