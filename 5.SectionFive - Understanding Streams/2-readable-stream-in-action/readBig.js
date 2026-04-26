const fs = require("node:fs/promises");

(async () => {
    console.time("readBig");
    const fileHandleRead = await fs.open("src.txt", "r");
    const fileHandleWrite = await fs.open("dest.txt", "w");

    const streamRead = fileHandleRead.createReadStream({
        highWaterMark: 64 * 1024, // 64 KB (default buffer size)
    });
    const streamWrite = fileHandleWrite.createWriteStream();

    streamRead.on("data", (chunk) => {
        if (!streamWrite.write(chunk)) { // if streamWrite's buffer is full, pause the streamRead
            streamRead.pause();
        }
    });

    streamWrite.on("drain", () => { // when streamWrite's buffer drained, resume the streamRead
        streamRead.resume();
    });
})();
