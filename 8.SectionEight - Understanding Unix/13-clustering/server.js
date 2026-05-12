const cpeak = require("cpeak")

const server = new cpeak()

server.route("get", "/", (req, res) => {
    res.json({message: "This is some text"})
})

server.route("get", "/heavy", (req, res) => {
    for (let i = 0; i < 1000000; i++) {}
    res.json({message: "The operation is now done."})
})

const PORT = 3500

server.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`)
})