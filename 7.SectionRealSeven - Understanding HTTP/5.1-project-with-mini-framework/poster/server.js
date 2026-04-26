const Butter = require("../../butter")

const USERS = [
    { id: 1, name: "Ko Htet", username: "kohtet", password: "string" },
    { id: 2, name: "Khin", username: "khin", password: "string" },
    { id: 3, name: "Ben", username: "ben", password: "string" },
];

const POSTS = [
    {
        id: 1,
        title: "Node.js",
        body: "Node.js® is a free, open-source, cross-platform JavaScript runtime environment that lets developers create servers, web apps, command line tools and scripts.",
        userId: 1,
    },
];

const PORT = 8000;

const server = new Butter();

// ------ Files Routes ------ //

server.route("get", "/", (req, res) => {
    res.sendFile("./public/index.html", "text/html");
});

server.route("get", "/styles.css", (req, res) => {
    res.sendFile("./public/styles.css", "text/css");
});

server.route("get", "/scripts.js", (req, res) => {
    res.sendFile("./public/scripts.js", "text/javascript");
});

// ------ JSON Routes ------ //

// Send the list of all the posts that we have
server.route("get", "/api/posts", (req, res) => {
    const posts = POSTS.map((post) => {
        const user = USERS.find((user) => user.id === post.userId);
        post.author = user.name;
        return post;
    });

    res.status(200).json(posts);
});

// Get all users
server.route("get", "/api/user", (req, res) => {
    
})

// Log a user and send back a token
server.route("post", "/api/login", (req, res) => {
    let body = ""
    req.on("data", (chunk) => {
        body += chunk.toString("utf-8")
    })

    req.on("end", () => {
        body = JSON.parse(body)

        const username = body.username
        const password = body.password

        // Check if the user exists
        const user = USERS.find((user) => user.username === username)

        // Check the password if the user was found
        if (user && user.password === password) {
            res.status(200).json({
                message: "Logged in successfully!"
            })
        } else {
            res.status(401).json({
                error: "Invalid username or password."
            })
        }
    })
})

server.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});