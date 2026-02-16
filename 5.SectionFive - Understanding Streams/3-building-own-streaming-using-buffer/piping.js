const {pipeline} = require('node:stream');
const fs = require('node:fs/promises');

// File Size Copied: 1 GB
// Memory Usage: 30 MB
// Execution Time: 1 s
// Maximum File Size Able to Copy: No Limit
(async () => {
    console.time("copy");

    const srcFile = await fs.open("src.txt", "r");
    const destFile = await fs.open("dest.txt", "w");

    const readStream = srcFile.createReadStream();
    const writeStream = destFile.createWriteStream();

    // console.log(readStream.readableFlowing);

    // readStream.pipe(writeStream);

    // console.log(readStream.readableFlowing);

    // readStream.unpipe(writeStream);

    // console.log(readStream.readableFlowing);

    // readStream.pipe(writeStream);

    // console.log(readStream.readableFlowing);

    // readStream.on("end", () => {
    //   console.timeEnd("copy");
    // });

    // Don't use pipe in production, use pipeline instead! It will automatically
    // handle the cleanings for you and give you an easy way for error handling
    pipeline(readStream, writeStream, (err) => {
        console.log(err);
        console.timeEnd("copy");
    });
})();
