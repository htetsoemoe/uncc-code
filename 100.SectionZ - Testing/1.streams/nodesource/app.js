// This example shows how to read a file using a readable stream and log its contents chunk by chunk.
// import * as fs from 'fs'



// async function logChunks(readable) {    // asynchronous function that takes a readable stream as an argument
//     for await (const chunk of readable)  { // using a for-await-of loop to read chunks from the stream
//         console.log(chunk)
//     }
// }

// const readable = fs.createReadStream('test.txt', { encoding: 'utf-8' })
// logChunks(readable)



// import { Readable } from "stream";
// import assert from "assert";
// async function readableToString(readable) {
//     let result = ""
//     for await (const chunk of readable) {
//         result += chunk
//     }
//     return result
// }

// const readable = Readable.from("Hello World", {encoding: "utf-8"})
// assert.equal(await readableToString(readable), "Hello World")


const { Readable } = require("stream");

// async generator function that produces a stream of strings
async function* generateStrings() {
    yield "Hello";
    yield " ";
    yield "World";
}

const readable = Readable.from(generateStrings(), { encoding: "utf-8" });

readable.on("data", (chunk) => {
    console.log(chunk);
});