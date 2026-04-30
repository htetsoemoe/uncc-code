const { stdin, stdout, stderr, argv, exit } = require("node:process");
const fs = require("node:fs");

const executePath = argv[0];
const executeFilePath = argv[1];

// get the first argument, and output the file content to stdout
const filePath = argv[2];


console.log(`argv[0] = executedPath: ${executePath}, argv[1] = executeFilePath: ${executeFilePath}`)
console.log(`argv[2] = filePath: ${filePath}`)

if (filePath) {
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(stdout);
  fileStream.on("end", () => {
    stdout.write("\n");
    exit(0);
  });
}

// stdin.pipe(stdout);
stdin.on("data", (data) => {
  stdout.write(data.toString("utf8").toUpperCase());
});
