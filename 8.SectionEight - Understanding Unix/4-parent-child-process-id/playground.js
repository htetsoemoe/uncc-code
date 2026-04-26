const { spawn, exec } = require("node:child_process");

// echo "something string" | tr ' ' '\n'

// console.log(process.env.PATH);
console.log(process.argv);
console.log(process.pid);

const subprocess = spawn("./playground", [
  "some string",
  "-f",
  34,
  "some more string",
  "-u",
]);

subprocess.stdout.on("data", (data) => {
  console.log(data.toString("utf-8"));
});

// exec(
//   " source .bashrc && echo 'something string' | tr ' ' '\n'",
//   {
//     shell: "/bin/zsh",
//   },
//   (error, stdout, stderr) => {
//     if (error) {
//       console.error(error);
//       return;
//     }

//     console.log(stdout);

//     console.log(`stderr: ${stderr}`);
//   }
// );
