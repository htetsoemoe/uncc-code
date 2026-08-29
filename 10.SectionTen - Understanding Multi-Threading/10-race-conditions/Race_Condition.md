# Race Condition

A race condition happens when two or more threads, workers, or processes access the same shared data at the same time, and the final result depends on the unpredictable order in which they run.

In simple words, the program has a race because multiple pieces of code are trying to change the same value together. Whichever one "wins" the timing race affects the final answer.

## Race Condition in `app.c`

In `app.c`, the global variable `number` is shared by all threads:

```c
long number = 0;
```

The program creates four threads:

```c
#define COUNT 100
#define THREADS 4
```

Each thread runs the `calc` function and increments `number` 100 times:

```c
++number;
```

At first glance, the expected final result is:

```text
COUNT * THREADS = 100 * 4 = 400
```

However, `++number` is not truly one single safe operation. Internally, it works more like this:

1. Read the current value of `number`.
2. Add `1`.
3. Write the new value back to `number`.

The race condition appears because multiple threads can perform these steps at the same time.

For example:

```text
Thread A reads number as 10
Thread B reads number as 10
Thread A writes 11
Thread B writes 11
```

Two increments happened, but the final value only increased by one. One update was lost.

Because there is no mutex, lock, or atomic operation protecting `number`, the final printed value may be less than the expected value.

## Race Condition in `app.js` and `calc.js`

The JavaScript example demonstrates the same problem with worker threads.

In `app.js`, a shared buffer is created:

```js
const number = new Uint32Array(new SharedArrayBuffer(4));
```

This creates one shared 32-bit integer that all workers can access. The program starts eight workers:

```js
const THREADS = 8;
```

Each worker receives the same shared buffer:

```js
workerData: { number: number.buffer },
```

Inside `calc.js`, each worker turns that shared buffer back into a `Uint32Array`:

```js
const number = new Uint32Array(workerData.number);
```

Then each worker increments the shared value 500,000 times:

```js
number[0] = number[0] + 1;
```

The expected result is:

```text
8 workers * 500,000 increments = 4,000,000
```

But `number[0] = number[0] + 1` is also a read-modify-write operation:

1. Read `number[0]`.
2. Add `1`.
3. Store the result back in `number[0]`.

Since all workers are modifying the same memory at the same time, two workers can read the same old value before either one writes the new value. This causes lost updates, so the final number may be lower than 4,000,000.

The comment in `calc.js` identifies this shared update as the critical section:

```js
// This is our critical section
number[0] = number[0] + 1;
```

A critical section is the part of the program where shared data is accessed or modified. Critical sections must be protected when multiple threads or workers can enter them at the same time.

## Why Race Conditions Are Dangerous

Race conditions are dangerous because they are timing-dependent. The program may look correct and may even produce the right answer sometimes, but it is not reliable.

The result can change depending on:

- CPU scheduling
- Number of threads or workers
- System load
- Timing between read and write operations
- Compiler or runtime behavior

This makes race condition bugs hard to reproduce and debug.

## How to Fix Race Conditions

To fix a race condition, the shared data must be protected so only one thread updates it at a time, or the update must be performed atomically.

Common solutions include:

- Mutexes or locks
- Atomic operations
- Semaphores
- Message passing instead of shared memory
- Avoiding shared mutable state

In C, the shared `number` could be protected with a `pthread_mutex_t` or changed using atomic operations.

In JavaScript worker threads, the increment should use `Atomics.add`:

```js
Atomics.add(number, 0, 1);
```

That makes the increment atomic, meaning the read, add, and write happen as one safe operation from the workers' point of view.

## Summary

The examples in `app.c`, `app.js`, and `calc.js` all show the same core race condition:

```text
Multiple threads or workers update the same shared counter without synchronization.
```

The expected result is based on simple arithmetic, but the real result may be smaller because some increments are lost. This happens because incrementing a variable is not automatically safe when multiple threads are involved.

The lesson is: whenever multiple threads or workers share and modify the same data, protect the critical section with synchronization or use atomic operations.
