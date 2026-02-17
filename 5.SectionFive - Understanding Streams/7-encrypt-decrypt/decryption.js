const { Transform } = require("node:stream");
const fs = require("node:fs/promises");

class Decrypt extends Transform {
    _transform(chunk, encoding, callback) {
        // <34 - 1, ff, a4 - 1, 11 - 1, 22 - 1....>
        for (let i = 0; i < chunk.length; ++i) {
            if (chunk[i] !== 255) {
                chunk[i] = chunk[i] - 1;
            }
        }
        callback(null, chunk);
    }
}

const clearLine = (dir) =>
    new Promise((resolve) => process.stdout.clearLine(dir, resolve));

const moveCursor = (dx, dy) =>
    new Promise((resolve) => process.stdout.moveCursor(dx, dy, resolve));

(async () => {
    const { size } = await fs.stat("output.txt");
    const readFileHandle = await fs.open("output.txt", "r");
    const writeFileHandle = await fs.open("decrypted.txt", "w");

    const readStream = readFileHandle.createReadStream();
    const writeStream = writeFileHandle.createWriteStream();
    const decrypt = new Decrypt();

    let processedBytes = 0;
    let lastLoggedPercent = -1;

    readStream.on("data", async (chunk) => {
        processedBytes += chunk.length;

        const percent = Math.floor((processedBytes / size) * 100);

        if (percent % 10 === 0 && percent !== lastLoggedPercent) {
            lastLoggedPercent = percent;

            await moveCursor(0, -1);
            await clearLine(0);
            process.stdout.write(`Decryption progress: ${percent}%`);
        }
    });

    writeStream.on("finish", () => {
        console.log("\nDecryption completed\n");
    });

    readStream.pipe(decrypt).pipe(writeStream);
})();
