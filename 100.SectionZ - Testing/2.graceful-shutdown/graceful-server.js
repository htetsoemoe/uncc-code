const net = require("net");

const server = net.createServer(); // Creates a new TCP or IPC server.
const sockets = new Set(); // Keep track of active connections

server.on("connection", (socket) => {
    console.log("A new connection to the server!");
    sockets.add(socket);

    // Remove socket from set when it closes
    socket.on("close", () => {
        sockets.delete(socket);
    });
});

server.listen(3000, "127.0.0.1", () => {
    console.log("Server is running on", server.address());
});

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
