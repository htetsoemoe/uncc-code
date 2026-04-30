const fs = require("node:fs/promises");

(async () => {
    console.time("writeMany");
    const fileHandle = await fs.open("text-big.txt", "w");

    const stream = fileHandle.createWriteStream();

    console.log(stream.writableHighWaterMark); // default highWaterMark = 16kb = 16384 bytes

    let i = 0;

    const numberOfWrites = 106350000;

    const writeMany = () => {
        while (i < numberOfWrites) {
            const buff = Buffer.from(` ${i} `, "utf-8");

            // this is our last write
            if (i === numberOfWrites - 1) {
                return stream.end(buff);
            }

            // if stream.write returns false, stop the loop
            if (!stream.write(buff)) break;

            i++;
        }
    };

    writeMany();

    // resume our loop once our stream's internal buffer is emptied
    stream.on("drain", () => {
        // console.log("Drained!!!");
        writeMany();
    });

    stream.on("finish", () => {
        console.timeEnd("writeMany");
        fileHandle.close();
    });
})();

