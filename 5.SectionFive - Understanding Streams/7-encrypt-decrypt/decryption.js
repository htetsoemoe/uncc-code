// Technically, it is a Caesar cipher at byte level. Very weak decryption but
// Perfect for learning streams

const { Transform } = require("node:stream");
const fs = require("node:fs/promises");

class Decrypt extends Transform {
    _transform(chunk, encoding, callback) {
        // <35 - 1, ff, a5 - 1, 12 - 1, 23 - 1....>
        for (let i = 0; i < chunk.length; ++i) {
            if (chunk[i] !== 255) {
                chunk[i] = chunk[i] - 1;
            }
        }
        callback(null, chunk);
    }
}

(async () => {
    const { size } = await fs.stat("output.txt");
    const readFileHandle = await fs.open("output.txt", "r");
    const writeFileHandle = await fs.open("decrypted.txt", "w");

    const readStream = readFileHandle.createReadStream();
    const writeStream = writeFileHandle.createWriteStream();

    const decrypt = new Decrypt();

    // Decryption progress with every 10 percent
    let processedBytes = 0;
    let lastLoggedPercent = 0;

    readStream.on("data", (chunk) => {
        processedBytes += chunk.length;
        const percent = Math.floor((processedBytes / size) * 100);
        if (percent >= lastLoggedPercent + 10 || percent === 100) {
            lastLoggedPercent = percent;
            console.log(`Decryption progress: ${percent}%`);
        }
    });

    writeStream.on("finish", () => {
        console.log("Decryption completed");
    });

    // Using piping
    readStream.pipe(decrypt).pipe(writeStream);
})();
