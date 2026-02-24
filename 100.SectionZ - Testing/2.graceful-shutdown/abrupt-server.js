const net = require("net")

const server = net.createServer()

server.on("connection", (socket) => {
    console.log("A new connection to the server!")
})

server.listen(3000, "127.0.0.1", () => {
    console.log("Server is running on ", server.address())
})