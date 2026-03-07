const net = require("net");
const fs = require("node:fs/promises");
const path = require("path");

const socket = net.createConnection({ host: "::1", port: 5050 }, async () => {
    const filePath = process.argv[2]; // process.argv[0] is node, process.argv[1] is client.js, so the file path is process.argv[2]
    const fileName = path.basename(filePath); // extract the file name from the file path, e.g. "C:/Users/John/Desktop/file.txt" -> "file.txt"
    const fileHandle = await fs.open(filePath, "r");
    const fileReadStream = fileHandle.createReadStream(); // the stream to read from

    socket.write(`fileName: ${fileName}-------`);

    // Reading from the source file
    fileReadStream.on("data", (data) => {
        if (!socket.write(data)) {
            fileReadStream.pause();
        }
    });

    socket.on("drain", () => {
        fileReadStream.resume();
    });

    fileReadStream.on("end", () => {
        console.log("The file was successfully uploaded!");
        socket.end();
    });
});
