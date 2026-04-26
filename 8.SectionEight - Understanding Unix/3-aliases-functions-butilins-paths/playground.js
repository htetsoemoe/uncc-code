const { spawn, exec } = require("node:child_process")

console.log(process.env.PATH)

const subprocess = spawn("bash", ["./scripts.sh"]);

subprocess.stdout.on("data", (data) => {
    console.log(data.toString("utf-8"))
})

// exec(
//     "echo 'something string' | tr ' ' '\n'",
//     {
//         shell: "/bin/bash",
//     },
//     (error, stdout, stderr) => {
//         if (error) {
//             console.error(error);
//             return;
//         }

//         console.log(stdout);

//         console.log(`stderr: ${stderr}`);
//     }
// );