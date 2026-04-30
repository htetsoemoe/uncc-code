const { spawn } = require("node:child_process");
const fs = require("node:fs");

// number_formatter is a compiled C/C++/Rust/Go executable in your project
// ["./dest.txt", "$", ","] is agruments for number_formatter (command/program)
const numberFormatter = spawn("number_formatter", ["./dest.txt", "$", ","]);

numberFormatter.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

numberFormatter.stderr.on("data", (data) => {
  console.log(`stderr: ${data}`);
});

numberFormatter.on("close", (code) => {
  if (code === 0) {
    console.log("The file was read, processed and written successfully!");
  } else {
    console.log("Something bad happened!");
  }
});

const fileStream = fs.createReadStream(
  "./src.txt"
);
fileStream.pipe(numberFormatter.stdin);
