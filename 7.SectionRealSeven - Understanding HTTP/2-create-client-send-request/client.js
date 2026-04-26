const http = require("node:http")

// Create a new HTTP agent with keep-alive enabled
const agent = new http.Agent({
    keepAlive: true,
})

// Create a new HTTP request using the http.request() method
const request = http.request({
    agent: agent,
    host: "localhost",
    port: 8050,
    method: "POST",
    path: "/create-post",
    headers: {
        "Content-Type": "application/json",
    }
})

// This event is emitted when the server responds to the request
request.on("response", (response) => {
    console.log("--------- STATUS CODE: ---------")
    console.log(response.statusCode)
    console.log("--------- HEADERS: ---------")
    console.log(response.headers)
    console.log("--------- BODY: ---------")

    response.on("data", (chunk) => {
        console.log(chunk.toString("utf-8"))
    })
})

// Write data to the request body using the request.write() method
request.write(JSON.stringify({ message: "Hello, Server!" }))
request.write(JSON.stringify({ message: "This is another message." }))

// End the request using the request.end() method, which signals that no more data will be sent to the server. 
// You can also pass data to the end() method, which will be written to the request body before ending the request.
request.end(
    JSON.stringify({ message: "This is the final message." })
)