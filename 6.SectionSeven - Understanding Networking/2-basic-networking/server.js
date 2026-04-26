const http = require("http");

const port = 4080;
const hostname = "127.0.0.1"; // loopback address or localhost

const server = http.createServer((req, res) => {
    const data = { message: "Hi there!" };

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Connection", "close");
    res.statusCode = 200;
    res.end(JSON.stringify(data));
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});
