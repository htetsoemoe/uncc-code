# `node:child_process` Reference

`node:child_process` is Node.js's built-in module for starting and managing other programs from a Node process.

It is useful when you want to:

- run operating system commands
- launch another program or script
- connect multiple commands with standard input/output
- automate shell tasks from JavaScript

## Import

```js
const { spawn, exec, execFile, fork } = require("node:child_process");
```

## Core Idea

A Node process can create a child process and communicate with it using:

- `stdin`: data sent into the child process
- `stdout`: normal output from the child process
- `stderr`: error output from the child process

This fits naturally with Unix ideas, where small programs are connected together through streams and pipes.

## Main APIs

### `spawn()`

`spawn()` starts a process directly and gives you stream access to its input and output.

Use it when:

- output may be large
- you want to read data gradually
- you want more control over the process lifecycle

Example:

```js
const { spawn } = require("node:child_process");

const child = spawn("node", ["-v"]);

child.stdout.on("data", (data) => {
  console.log(data.toString());
});

child.stderr.on("data", (data) => {
  console.error(data.toString());
});

child.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});
```

### `exec()`

`exec()` runs a command inside a shell and gives the final output in a callback.

Use it when:

- the command is short
- you want a simple one-shot result
- you need shell features like pipes, redirection, or shell syntax

Example:

```js
const { exec } = require("node:child_process");

exec("echo hello", (error, stdout, stderr) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(stdout);
  console.log(stderr);
});
```

Important note:

- `exec()` buffers output in memory
- shell syntax is supported because the command is run through a shell
- avoid building `exec()` commands from untrusted user input because of shell injection risk

### `execFile()`

`execFile()` is similar to `exec()`, but it runs a file directly instead of going through a shell by default.

Use it when:

- you want a simpler callback-based API
- you do not need shell features
- you want less shell-related risk

Example:

```js
const { execFile } = require("node:child_process");

execFile("node", ["-v"], (error, stdout, stderr) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(stdout);
});
```

### `fork()`

`fork()` is a special version of `spawn()` used to start another Node.js script.

It also creates an IPC channel so the parent and child can send JavaScript messages to each other.

Example:

```js
const { fork } = require("node:child_process");

const child = fork("./worker.js");

child.send({ task: "start" });

child.on("message", (message) => {
  console.log(message);
});
```

## `spawn()` vs `exec()`

Use `spawn()` when you want streaming output and better control.

Use `exec()` when you want shell behavior and a final completed result.

Quick comparison:

- `spawn()`:
  - does not use a shell by default
  - returns streams
  - better for large output
- `exec()`:
  - uses a shell
  - returns buffered output in a callback
  - convenient for short shell commands

## Relating This To Your `playground.js`

Your file imports:

```js
const { spawn, exec } = require("node:child_process");
```

You are showing two approaches:

1. `spawn("echo", [...])`
2. `exec("echo 'something string' | tr ' ' '\n'", ...)`

Why `exec()` works better for that example:

- your command uses a pipe: `|`
- pipes are shell syntax
- `exec()` runs the command through a shell, so the pipe is understood

Why the commented `spawn()` version is different:

- `spawn()` does not interpret `|`
- it treats `"|"` as a normal argument unless you explicitly run a shell or manually pipe processes yourself

## If You Want Piping With `spawn()`

You can connect processes manually:

```js
const { spawn } = require("node:child_process");

const echo = spawn("echo", ["something string"]);
const tr = spawn("tr", [" ", "\n"]);

echo.stdout.pipe(tr.stdin);

tr.stdout.on("data", (data) => {
  console.log(data.toString());
});
```

This is closer to the Unix model because you are wiring the streams yourself.

## Common Events

Child processes often use these events:

- `data` on `stdout` and `stderr`
- `close` when the process exits and streams are closed
- `exit` when the process ends
- `error` if the process could not be started

Example:

```js
child.on("error", (err) => {
  console.error("Failed to start process:", err);
});
```

## Practical Notes

- Commands can behave differently between Unix and Windows.
- Utilities like `tr` are common on Unix-like systems but may not exist in plain Windows shells.
- If a command depends on shell features, `exec()` is often simpler.
- If performance and safety matter, prefer `spawn()` or `execFile()` when possible.

## Summary

`node:child_process` lets Node interact with the operating system by starting other processes.

- `spawn()` is best for streams and long-running processes
- `exec()` is best for short shell commands
- `execFile()` is a safer callback-based alternative when shell features are unnecessary
- `fork()` is for creating another Node process with message passing

For your current example, `exec()` is the easier fit because the command uses a Unix pipe.
