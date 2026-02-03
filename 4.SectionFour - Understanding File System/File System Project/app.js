const fs = require("fs/promises");

(async () => {

    // Implementing Create a file command
    // Command: create a file <path>
    const CREATE_FILE = "create a file";

    // Create a file handler 
    const createFileHandler = async (path) => {
        try {
            // We want to check whether or not we already have that file
            const existingFileHandle = await fs.open(path, "r");
            existingFileHandle.close();

            // We already have that file
            return console.log(`The File ${path} already exists`);
        } catch (error) {
            // We don't have that file, so we can create it
            const newFileHandle = await fs.open(path, "w"); // 'w' means open file for writing. The file is created (if it does not exist) or truncated (if it exists)
            newFileHandle.close();
            return console.log(`The File ${path} has been created successfully`);
        }
    }

    // Open the command.txt file
    const commandFileHandler = await fs.open("./command.txt", "r"); // 'r' means open file for reading. An exception occurs if the file does not exists

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
        const command = buff.toString("utf-8");

        // Create a file command:
        // create a file <path>
        if (command.includes(CREATE_FILE)) {
            const filePath = command.substring(CREATE_FILE.length + 1);
            createFileHandler(filePath);
        }
    })

    // Watcher to monitor changes in command.txt
    // Returns an async iterator that watches for changes on filename, where filename is either a file or a directory.
    const watcher = fs.watch("./command.txt");
    for await (const event of watcher) {
        if (event.eventType === "change") {
            commandFileHandler.emit("change");
        }
    }
})();