const { Worker } = require("worker_threads");
const fs = require("fs");

setTimeout(() => {
    fs.writeFile("./text.txt", "This is some text for testing...", (err) => {
        if (err) return console.log(err);
        console.log("File created successfully!");
    });
}, 3000);

// setTimeout(() => {
//   // new Worker("./calc.js");
// }, 3000);

// const a = 1000;

// console.log(a);

// for (let i = 0; i < 10_000_000_000; i++) {}

// setInterval(() => {}, 50);

// process.exit(0);
