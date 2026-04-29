# Bash Notes: `|`, `>`, `<`, `>>`, `0`, `1`, `2`

In Bash, programs communicate through **streams**. A stream is just a flow of data.

Every command starts with three standard streams:

- `0` = **stdin** = standard input
- `1` = **stdout** = standard output
- `2` = **stderr** = standard error

These numbers are called **file descriptors**.

## 1. Standard Streams

### `0` - Standard Input

`stdin` is where a command reads input from.

By default, input usually comes from the keyboard.

Example:

```bash
cat
```

`cat` waits for input from the keyboard because it is reading from `stdin` (`0`).

You can also redirect input from a file:

```bash
cat < file.txt
```

Now `cat` reads from `file.txt` instead of the keyboard.

### `1` - Standard Output

`stdout` is the normal output of a command.

By default, it goes to the terminal screen.

Example:

```bash
echo "Hello"
```

This prints `Hello` to `stdout` (`1`), and the terminal shows it.

### `2` - Standard Error

`stderr` is where error messages are sent.

By default, it also appears on the terminal, but it is separate from normal output.

Example:

```bash
ls missing-file
```

This sends the error message to `stderr` (`2`), not `stdout`.

That separation is useful because we can redirect output and errors differently.

## 2. Output Redirection with `>`

The `>` operator redirects **standard output** (`stdout`, `1`) to a file.

Example:

```bash
echo "Hello" > file.txt
```

What happens:

- `echo "Hello"` produces output
- `>` sends that output into `file.txt`
- if `file.txt` does not exist, Bash creates it
- if `file.txt` already exists, Bash **overwrites** it

Equivalent form:

```bash
echo "Hello" 1> file.txt
```

Because `>` means `1>` by default.

## 3. Input Redirection with `<`

The `<` operator redirects a file into a command's **standard input** (`stdin`, `0`).

Example:

```bash
wc -l < file.txt
```

What happens:

- `wc -l` counts lines
- `< file.txt` gives the contents of `file.txt` to `wc`

This is similar in result to:

```bash
cat file.txt | wc -l
```

But `wc -l < file.txt` is usually simpler and more efficient because it avoids starting `cat`.

## 4. Append Redirection with `>>`

The `>>` operator also redirects **standard output**, but instead of replacing the file, it **appends** to the end.

Example:

```bash
echo "First line" > notes.txt
echo "Second line" >> notes.txt
```

Result in `notes.txt`:

```text
First line
Second line
```

Important difference:

- `>` overwrites
- `>>` appends

Equivalent form:

```bash
echo "More text" 1>> notes.txt
```

## 5. Pipe Operator `|`

The pipe operator `|` sends the **stdout** of one command to the **stdin** of another command.

It connects commands together.

Basic example:

```bash
ls | sort
```

What happens:

- `ls` outputs a list of files
- `|` passes that output to `sort`
- `sort` receives it as input and sorts it

Another example:

```bash
cat file.txt | grep "bash"
```

What happens:

- `cat file.txt` prints the file contents
- the pipe sends that text to `grep`
- `grep` searches for lines containing `bash`

This is one of the most powerful Unix ideas:

- one command produces data
- another command transforms it
- another command filters it

Example chain:

```bash
ps aux | grep nginx | wc -l
```

This can:

- list running processes
- filter lines containing `nginx`
- count how many matching lines were found

## 6. Understanding `0`, `1`, and `2` with Redirection

Since Bash streams have numbers, we can redirect them directly.

### Redirect stdout only

```bash
ls > output.txt
```

or

```bash
ls 1> output.txt
```

Both mean the same thing.

### Redirect stderr only

```bash
ls missing-file 2> errors.txt
```

What happens:

- normal output would stay on screen
- error messages go into `errors.txt`

### Redirect stdin explicitly

```bash
sort 0< names.txt
```

This works, though `< names.txt` is more common.

## 7. stdout vs stderr

This distinction matters a lot.

Example:

```bash
find / -name "file.txt" > results.txt
```

What happens:

- matching file paths go to `results.txt`
- permission errors may still appear on the screen

Why?

Because:

- file paths are sent to `stdout`
- permission-denied messages are sent to `stderr`

To save only errors:

```bash
find / -name "file.txt" 2> errors.txt
```

To save both normal output and errors:

```bash
find / -name "file.txt" > all-output.txt 2>&1
```

Meaning:

- `> all-output.txt` sends `stdout` to the file
- `2>&1` sends `stderr` to wherever `stdout` is currently going

## 8. Common Examples

### Write command output into a file

```bash
date > today.txt
```

### Append new output to an existing log

```bash
echo "Backup completed" >> backup.log
```

### Use a file as input

```bash
sort < names.txt
```

### Send one command's output into another command

```bash
history | grep git
```

### Save errors only

```bash
gcc program.c 2> compile-errors.txt
```

### Save output and errors separately

```bash
gcc program.c > build-output.txt 2> build-errors.txt
```

## 9. Quick Comparison

| Symbol | Meaning | Default Stream |
|---|---|---|
| `<` | take input from a file | `0` |
| `>` | write output to a file, overwrite | `1` |
| `>>` | write output to a file, append | `1` |
| `|` | send output of one command to input of another | `1` to `0` |
| `0` | standard input | keyboard or redirected file |
| `1` | standard output | terminal or redirected file |
| `2` | standard error | terminal or redirected file |

## 10. Key Ideas to Remember

- Bash commands use three standard streams: `stdin`, `stdout`, and `stderr`
- `0`, `1`, and `2` are the numeric file descriptors for those streams
- `>` redirects normal output and overwrites a file
- `>>` redirects normal output and appends to a file
- `<` gives a file as input to a command
- `|` connects commands by sending output from one command into another
- `stderr` is separate from `stdout`, which allows errors and normal output to be handled differently

## 11. Short Summary

Think of Bash like a plumbing system:

- `|` is a pipe between commands
- `>` sends output into a file
- `>>` adds output to the end of a file
- `<` feeds a file into a command
- `0`, `1`, and `2` identify input, normal output, and error output

Learning these operators is important because they are the foundation of shell scripting and command-line workflow in Unix and Linux.
