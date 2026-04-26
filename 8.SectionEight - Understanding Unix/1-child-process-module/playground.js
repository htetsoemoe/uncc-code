const { spawn, exec } = require("node:child_process");

// echo "something string" | tr ' ' '\n'

// const subprocess = spawn("echo", ["something", "|", "tr", " ", "\n"]);

// subprocess.stdout.on("data", (data) => {
//     console.log(data.toString("utf-8"));
// });

// tr is 'transform' from ' ' to '\n'
exec("echo 'something string' | tr ' ' '\n'", (error, stdout, stderr) => {
    if (error) {
        console.error(error);
        return;
    }

    console.log(stdout);

    console.log(`stderr: ${stderr}`);
});