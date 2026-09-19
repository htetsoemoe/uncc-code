const tls = require("tls");
const fs = require("fs");

// Creating a TLS server, type is <tls.Server>
const server = tls.createServer({
  key: fs.readFileSync("./server/facebook-private.pem"),
  cert: fs.readFileSync("./facebook-cert.pem"),
  // Uncomment to do mutual TLS (make sure client also has a valid certificate):
  // ca: [fs.readFileSync("./<client-CA>.pem")], // this is whatever CA that issued the client's cert
  // requestCert: true, // request a certificate from clients
  // rejectUnauthorized: true, // set to true to reject unauthorized clients
});

// In production we don't really need to do anything with this event when using TLS
server.on("connection", () => {
  console.log(
    "TCP handshake successfully completed, traffic is NOT encrypted yet."
  );
});

server.on("secureConnection", (socket) => {
  console.log(
    "TLS handshake successfully completed, secure connection established."
  );

  socket.on("data", (data) => {
    console.log("Received from client: ", data.toString("utf8"));
    socket.write("Hello from facebook!");
  });

  socket.on("end", () => {
    console.log("Client disconnected.");
  });
});

server.on("tlsClientError", (err, socket) => {
  console.error("TLS Error:");
  console.error(err);
});

const PORT = 8000;
server.listen(PORT, "127.0.0.1", () => {
  console.log(`Facebook server running on port ${PORT}`);

  console.log(server.address());
});
