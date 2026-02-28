const net = require("net")

const server = net.createServer()

// An array of client sockets
const clients = []

server.on("connection", (socket) => {
    console.log(`A new connection to the server!`)

    const clientId = clients.length + 1
    socket.write(`id-${clientId}`)

    socket.on("data", (data) => {
        const dataString = data.toString("utf-8")
        const id = dataString.substring(0, dataString.indexOf("-"))
        const message = dataString.substring(dataString.indexOf("-message-") + 9)
        clients.map((client) => {
            client.socket.write(`User ${id}: ${message}`)
        })
    })

    // Broadcasting a message to everyone when someone leave
    socket.on("end", () => {
        const index = clients.findIndex(c => c.socket === socket)
        if (index !== -1) {
            clients.splice(index, 1)
        }
        clients.map((client) => {
            client.socket.write(`User ${clientId} left!`)
        })
    })

    socket.on("error", (err) => {
        if (err.code === "ECONNRESET") {
            console.log(`User ${clientId} connection was reset abruptly.`)
        } else {
            console.error(`Socket error for User ${clientId}:`, err.message)
        }
        // Cleanup on error as well
        const index = clients.findIndex(c => c.socket === socket)
        if (index !== -1) {
            clients.splice(index, 1)
        }
        clients.map((client) => {
            client.socket.write(`User ${clientId} disconnected abruptly!`)
        })
    })

    clients.push({ id: clientId.toString(), socket })
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
    for (const socket of clients) {
        socket.end(); // Sends the FIN packet (clean close)
    }
}

// Catch Ctrl+C (SIGINT) to trigger the shutdown
process.on("SIGINT", gracefulShutdown);