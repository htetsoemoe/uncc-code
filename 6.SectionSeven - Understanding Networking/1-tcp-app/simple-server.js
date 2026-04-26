const net = require("net")

// Creates a new TCP or IPC server
const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        console.log(data)
    })
})

server.listen(3000, "127.0.0.1", () => {
    console.log(`Server is running on ${server.address()}`)
})