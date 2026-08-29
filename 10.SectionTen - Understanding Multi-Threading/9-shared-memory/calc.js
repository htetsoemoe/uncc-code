const { workerData, threadId } = require("worker_threads");

const data = Buffer.from(workerData.data);
const data2 = Buffer.from(workerData.data2);

console.log(`Thread ${threadId} data: `, data);
console.log(`Thread ${threadId} data2: `, data2);

// console.log(`data[${threadId}]: ${data[threadId]}`);
// console.log(`data[${threadId}]: ${data2[threadId]}`);

data[threadId] = 255;
data2[threadId] = 100;
