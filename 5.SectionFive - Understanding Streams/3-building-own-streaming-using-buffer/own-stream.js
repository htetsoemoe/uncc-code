const fs = require("node:fs/promises");

// File Size Copied: 1 GB
// Memory Usage: 1 GB
// Execution Time: 900 ms
// Maximum File Size Able to Copy: 2 GB
// (async () => {
//   console.time("copy");
//   const destFile = await fs.open("text-copy.txt", "w");
//   const result = await fs.readFile("text-big.txt");

//   await destFile.write(result);

//   console.timeEnd("copy");
// })();



// File Size Copied: 1 GB
// Memory Usage: 30 MB
// Execution Time: 2 s
// Maximum File Size Able to Copy: No Limit
(async () => {
  console.time("copy");

  const srcFile = await fs.open("src.txt", "r");
  const destFile = await fs.open("dest.txt", "w");

  let bytesRead = -1;

  while (bytesRead !== 0) {
    const readResult = await srcFile.read();
    bytesRead = readResult.bytesRead;

    if (bytesRead !== readResult.buffer.length) {
      // we have some null bytes, remove them at the end of the returned buffer
      // and then write to our file
      const indexOfNotFilled = readResult.buffer.indexOf(0); // indexOf @return = The index of the first occurrence of value in buf, or -1 if buf does not contain value.
      const newBuffer = Buffer.alloc(indexOfNotFilled);

      // Buffer<ArrayBuffer>.copy(target: Uint8Array<ArrayBufferLike>, targetStart?: number, sourceStart?: number, sourceEnd?: number): number
      // Copies data from a region of buf to a region in target, even if the target-memory region overlaps with buf.
      readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled);
      destFile.write(newBuffer);
    } else {
      destFile.write(readResult.buffer);
    }
  }

  console.timeEnd("copy");
})();