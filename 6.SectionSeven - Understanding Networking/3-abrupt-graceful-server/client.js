/**
Graceful vs. Abrupt: 
client.on("end") triggers when the server closes the connection cleanly (FIN packet (Finish)). 
client.on("error") triggers when the connection is severed unexpectedly (RST packet (Reset)).

Always Listen for Errors: 
In Node.js networking, it's a best practice to always attach an .on("error") listener 
to any Stream or Socket to prevent your app from crashing.
*/

const net = require("net")

const client = net.createConnection({ host: "127.0.0.1", port: 3000}, () => {
    console.log("Connected to the server!")
})

// client.on("error") triggers when the connection is severed unexpectedly (RST packet (Reset)).
// Abrupt (Your Error): Server process dies -> Sends RST -> Client throws ECONNRESET.
client.on("error", (err) => {
    if (err.code === "ECCONNRESET") {
        console.log("Server closed the connection abruptly.")
    } else {
        console.log("A client error occurred ", err.message)
    }
})

// client.on("end") triggers when the server closes the connection cleanly (FIN packet (Finish)).
// Graceful (This Code): socket.end() -> Sends FIN -> Client receives end event -> Connection closes peacefully.
client.on("end", () => {
    console.log("Connection was ended!")
})
