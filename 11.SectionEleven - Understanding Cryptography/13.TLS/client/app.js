const tls = require("tls");
const fs = require("fs");

// We can also change this to mTLS for increased security to reduce the risk of man-in-the-middle attacks and unauthorized access.

const options = {
  host: "www.facebook.com",
  port: 8000,
  ca: [fs.readFileSync("./UNCC-cert.pem")], // this means to only trust this root CA!
  // Provide a cert and a key here as well if you want to do mutual TLS
};

// Connecting to the server, type is <tls.TLSSocket>
const client = tls.connect(options, () => {
  console.log("Connected to server!");

  console.log("Facebook's certificate: ");
  console.log(client.getPeerCertificate());

  console.log("Cipher suite and TLS version negotiated: ");
  console.log(client.getCipher());

  client.write("Hello from a user!");
});

// Receiving data from the server
client.on("data", (data) => {
  console.log("Received from server: ", data.toString("utf8"));
  client.end();
});

client.on("end", () => {
  console.log("Disconnected from server.");
});
