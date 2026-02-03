const fs = require("fs/promises");

(async () => {
    const commandFileHandler = await fs.open("./command.txt", "r");

    commandFileHandler.on("change", async () => {
        // Get the size of our file
        const size = (await commandFileHandler.stat()).size;
        // Create a buffer to hold the content
        const buff = Buffer.alloc(size);

        // The location at which we want to start filling our buffer
        const offset = 0;
        // How many bytes we want to read
        const length = size;
        // The position from which we want to start reading
        const position = 0;

        // We always want to read the whole content (from beginning to end): stored in buff
        await commandFileHandler.read(buff, offset, length, position);
        console.log(buff.toString("utf-8"));
    })

    const watcher = fs.watch("./command.txt");
    for await (const event of watcher) {
        if (event.eventType === "change") {
            commandFileHandler.emit("change");
        }
    }
})();