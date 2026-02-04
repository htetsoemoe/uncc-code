const fs = require("fs/promises");

(async () => {

    // Implementing Create a file command
    // Command: create a file <path>
    const CREATE_FILE = "create a file";

    // Command: delete a file <>
    const DELETE_FILE = "delete a file";

    // Command: rename a file <oldPath> to <newPath>
    const RENAME_FILE = "rename a file";

    // Command: add to a file <path> content <content>
    const ADD_TO_FILE = "add to a file";

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

    // Delete a file handler
    const deleteFileHandler = async (path) => {
        console.log(`Deleting ${path}...`)
    }

    // Rename a file handler
    const renameFileHandler = async (oldPath, newPath) => {
        console.log(`Renaming ${oldPath} to ${newPath}`)
    }

    // Add to a file handler
    const addToFileHandler = async (path, content) => {
        console.log(`Adding to ${path}... `)
        console.log(`the content: ${content}...`)
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

        // Delete a file command:
        // delete a file <path>
        if (command.includes(DELETE_FILE)) {
            const filePath = command.substring(DELETE_FILE.length + 1);
            deleteFileHandler(filePath);
        }

        // Rename a file command:
        // rename a file <oldPath> to <newPath>
        if (command.includes(RENAME_FILE)) {
            const _idx = command.indexOf(" to ");
            const oldPath = command.substring(RENAME_FILE.length + 1, _idx);
            const newPath = command.substring(_idx + 4);
            renameFileHandler(oldPath, newPath);
        }

        // Add to a file command:
        // add to a file <path> this content: <content>
        if (command.includes(ADD_TO_FILE)) {
            const _idx = command.indexOf(" this content: ");
            const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
            const content = command.substring(_idx + 15);
            addToFileHandler(filePath, content);
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