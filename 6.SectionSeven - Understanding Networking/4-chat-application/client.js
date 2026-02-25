const net = require("net")
const readline = require("readline/promises")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const socket = net.createConnection(
    { host: "127.0.0.1", port: 3000 },
    async () => {
        console.log(`Connected to the server!`)

        const message = await rl.question("Enter a message > ")
        socket.write(message)
    }
)

socket.on("data", (data) => {
    console.log(data.toString("utf-8"))
})

// client.on("error") triggers when the connection is severed unexpectedly (RST packet (Reset)).
// Abrupt (Your Error): Server process dies -> Sends RST -> Client throws ECONNRESET.
socket.on("error", (err) => {
    if (err.code === "ECCONNRESET") {
        console.log("Server closed the connection abruptly.")
    } else {
        console.log("A client error occurred ", err.message)
    }
})

// client.on("end") triggers when the server closes the connection cleanly (FIN packet (Finish)).
// Graceful (This Code): socket.end() -> Sends FIN -> Client receives end event -> Connection closes peacefully.
socket.on("end", () => {
    console.log("Connection was ended!")
})