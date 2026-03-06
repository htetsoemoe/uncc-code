const net = require('net')
const fs = require('node:fs/promises')

const socket = net.createConnection({ host: "::1", port: 5050 }, async () => {
    const filePath = './text.txt'
    const fileHandle = await fs.open(filePath, 'r')
    const fileReadStream = fileHandle.createReadStream() // create a read stream from the file handle

    // Reading from the source file
    fileReadStream.on('data', (chunk) => {
        if (!socket.write(chunk)) {
            fileReadStream.pause() // pause the read stream if the socket is not ready to accept more data
        }
    })

    socket.on('drain', () => {
        fileReadStream.resume() // resume the read stream when the socket is drained
    })

    fileReadStream.on('end', () => {
        console.log(`The file was successfully uploaded!`)
        socket.end() // end the socket connection when the file read stream ends
    })
})