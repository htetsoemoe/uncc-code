const net = require('net')
const fs = require('node:fs/promises')

const server = net.createServer(() => { })

let fileHandle, fileWriteStream

server.on('connection', async (socket) => {
    console.log("New connection!")

    socket.on('data', async (data) => {
        if (!fileHandle) {
            socket.pause() // pause the socket to prevent data from flowing until we are ready
            fileHandle = await fs.open(`storage/test.txt`, 'w')
            fileWriteStream = fileHandle.createWriteStream() // the stream to write to the file

            // Writing to our destination file, discard the headers and write the body to the file
            fileWriteStream.write(data)

            socket.resume() // Resumes reading after a call to socket.pause(). resume the socket to allow data to flow again
            fileWriteStream.on('drain', () => {
                socket.resume() // resume the socket when the write stream is drained
            })
        } else {
            if (!fileWriteStream.write(data)) {
                socket.pause() // pause the socket if the write stream is not ready to accept more data
            }
        }
    })

    // This end event happens when the client.js file ends the connection by calling socket.end()
    socket.on('end', async () => {
        fileHandle.close() // close the file handle when the connection ends
        fileHandle = null
        fileWriteStream = null
        console.log("Connection ended!")
    })
})

server.listen(5050, "::1", () => {
    console.log(`Uploader server running on ${JSON.stringify(server.address())}`)
})