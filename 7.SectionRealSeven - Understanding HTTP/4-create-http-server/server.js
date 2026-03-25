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
})

server.listen(3000, () => {
    console.log(`Server is running on http://localhost:${3000}`)
})