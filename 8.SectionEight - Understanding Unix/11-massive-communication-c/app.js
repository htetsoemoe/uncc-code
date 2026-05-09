const { spawn } = require("node:child_process");
const fs = require("node:fs");

// number_formatter is a compiled C/C++/Rust/Go executable in your project
// ["./dest.txt", "$", ","] is agruments for number_formatter (command/program)
const numberFormatter = spawn("./number_formatter", ["./dest.txt", "$", ","]);

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

// Use gigantic file path e.g, /user/your_name/project/text-big.txt
const fileStream = fs.createReadStream(
  "./text-big.txt"
);
fileStream.pipe(numberFormatter.stdin);


// numberFormatter.stdin.write("324 8236 4238");
// numberFormatter.stdin.write("3123 24 8236 4238");
// numberFormatter.stdin.write("324 12 38236 4238");
// numberFormatter.stdin.end("321 234 8236 4231 23128"); // sending EOF sign
