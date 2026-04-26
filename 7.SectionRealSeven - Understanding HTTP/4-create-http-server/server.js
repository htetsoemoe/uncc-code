const http = require('node:http')
const fs = require('node:fs/promises')

const server = http.createServer()

server.on("request", async (req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        res.setHeader("Content-Type", "text/html")

        const fileHandle = await fs.open("./public/index.html", "r")
        const fileStream = fileHandle.createReadStream()

        fileStream.pipe(res)
    }

    if (req.url == '/styles.css' && req.method == 'GET') {
        res.setHeader("Content-Type", "text/css")

        const fileHandle = await fs.open("./public/styles.css", "r")
        const fileStream = fileHandle.createReadStream

        fileStream.pipe(res)
    }

    if (req.url === '/scripts.js' && req.method === 'GET') {
        res.setHeader("Content-Type", "text/javascript")

        const fileHandle = await fs.open("./public/scripts.js", "r")
        const fileStream = fileHandle.createReadStream()

        fileStream.pipe(res)
    }

    if (req.url === "/login" && req.method === "POST") {
        response.setHeader("Content-Type", "application/json");
        response.statusCode = 200;

        const body = {
            message: "Logging you in...",
        };

        response.end(JSON.stringify(body));
    }

    if (req.url === "/user" && req.method === "PUT") {
        response.setHeader("Content-Type", "application/json");
        response.statusCode = 401;

        const body = {
            message: "You first have to login.",
        };

        response.end(JSON.stringify(body));
    }

    // upload route
    if (req.url === '/upload' && req.method === 'PUT') {
        const fileHandle = await fs.open("./storage/image.jpeg", "w")
        const fileStream = fileHandle.createWriteStream()
        res.setHeader("Content-Type", "application/json")

        req.pipe(fileStream)

        req.on("end", () => {
            res.end(JSON.stringify({message: "File was uploaded successfully!"}))
        })
    }
})

server.listen(3000, () => {
    console.log(`Server is running on http://localhost:${3000}`)
})