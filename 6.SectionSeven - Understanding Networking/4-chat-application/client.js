const net = require("net")
const readline = require("readline/promises")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const clearLine = (dir) => {
    return new Promise((resolve, reject) => {
        process.stdout.clearLine(dir, () => {
            resolve()
        })
    })
}

const moveCursor = (dx, dy) => {
    return new Promise((resolve, reject) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve()
        })
    })
}

let id

const socket = net.createConnection(
    { host: "127.0.0.1", port: 3000 },
    async () => {
        console.log(`Connected to the server!`)

        const ask = async () => {
            const message = await rl.question("Enter a message > ")

            // move the cursor one line up
            await moveCursor(0, -1)

            // clear the current line that the cursor is in
            await clearLine(0)
            socket.write(`${id}-message-${message}`)
        }

        ask()

        socket.on("data", async (data) => {
            // log an empty line
            console.log()

            // move the cursor one line up
            await moveCursor(0, -1)

            // clear that line cursor just moved into
            await clearLine(0)

            if (data.toString("utf-8").substring(0, 2) === "id") {
                // When we are getting the id
                // everything from the third character up until the end
                id = data.toString("utf-8").substring(3)
                console.log(`Your id id ${id}\n`)
            } else {
                // When we are getting a message...
                console.log(data.toString("utf-8"))   
            }

            ask()
        })
    }
)


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