// Technically, it is a Caesar cipher at byte level. Very weak encryption but
// Perfect for learning streams

const { Transform } = require("node:stream");
const fs = require("node:fs/promises");

class Encrypt extends Transform {
    _transform(chunk, encoding, callback) {
        // <34 + 1, ff, a4 + 1, 11 + 1, 22 + 1....>
        for (let i = 0; i < chunk.length; ++i) {
            if (chunk[i] !== 255) { // single byte = 0000 0000 (0) to 1111 1111 (255)
                chunk[i] = chunk[i] + 1;
            }
        }
        callback(null, chunk);
    }
}

(async () => {
    const { size } = await fs.stat("input.txt");
    const readFileHandle = await fs.open("input.txt", "r");
    const writeFileHandle = await fs.open("output.txt", "w");

    const readStream = readFileHandle.createReadStream();
    const writeStream = writeFileHandle.createWriteStream();

    const encrypt = new Encrypt();

    // Encryption progress with every 10 percent
    let processedBytes = 0;
    let lastLoggedPercent = 0;

    readStream.on("data", (chunk) => {
        processedBytes += chunk.length;
        const percent = Math.floor((processedBytes / size) * 100);
        if (percent >= lastLoggedPercent + 10 || percent === 100) {
            lastLoggedPercent = percent;
            console.log(`Encryption progress: ${percent}%`);
        }
    });

    writeStream.on("finish", () => {
        console.log("Encryption completed");
    });

    // Using piping
    readStream.pipe(encrypt).pipe(writeStream);
})();
