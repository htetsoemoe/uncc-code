const { Worker } = require("worker_threads");

// const a = 400;

new Worker("./calc.js");

while (true) { }

// const thread1 = new Worker("./calc.js");
// const thread2 = new Worker("./calc.js");
// // 300
// for (let i = 0; i < 10_000_000_000; i++) {}

// setTimeout(() => {
//   const thread3 = new Worker("./calc.js");
// }, 0);

// console.log(a);
