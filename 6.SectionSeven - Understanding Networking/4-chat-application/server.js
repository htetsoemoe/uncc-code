const net = require("net")

const server = net.createServer()

// An array of client sockets
const clients = []

server.on("connection", (socket) => {
    console.log(`A new connection to the server!`)

    socket.on("data", (data) => {
        clients.map((socket) => {
            socket.write(data)
        })
    })

    clients.push(socket)
})

server.listen(3000, "127.0.0.1", () => {
    console.log(`Server is running at: ${server.address()}`)
})

// Graceful (This Code): socket.end() -> Sends FIN -> Client receives end event -> Connection closes peacefully.
// Function to shut down everything safely
function gracefulShutdown() {
    console.log("\nShutting down server...");

    // 1. Stop accepting new connections
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });

    // 2. Tell all current clients to end
    for (const socket of sockets) {
        socket.end(); // Sends the FIN packet (clean close)
    }
}

// Catch Ctrl+C (SIGINT) to trigger the shutdown
process.on("SIGINT", gracefulShutdown);