// Run this file as sudo: sudo $(which node) app.js

const https = require("https");
const fs = require("fs");

const websiteName = "facebook";

const options = {
  key: fs.readFileSync(`./${websiteName}-private.pem`),
  cert: fs.readFileSync(`./${websiteName}-cert.pem`),
};

const server = https.createServer(options, (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hey there!\n");
});

server.listen(443, "127.0.0.1", () => {
  console.log(`HTTPS Server running on https://${websiteName}.com`);
});

/**

// ------- Becoming a CA: ------- //

// Generate CA private key:
openssl genrsa -out UNCC-private.pem 2048

// Generate CA certificate (remember the public key is always included in a an X509 certificate):
openssl req -x509 -new -key UNCC-private.pem -out UNCC-cert.pem -days 365 -sha256

// ------- For the Website: ------- //

// Generate website private key:
openssl genrsa -out facebook-private.pem 2048

// Generate a Certificate Signing Request (this is what one sends to a CA to then get a signed certificated):
openssl req -new -key facebook-private.pem -out facebook-csr.pem -config openssl-san.cnf

// CA issuing a certificate for the website:
openssl x509 -req -in facebook-csr.pem -CA UNCC-cert.pem -CAkey UNCC-private.pem -CAcreateserial -out facebook-cert.pem -days 365 -sha256 -extfile openssl-san.cnf -extensions ext

// Make sure that you have also done all these:
//  - Added UNCC-cert.pem to the trusted root CAs list (refer to the instructions.txt file).
//  - Modified your DNS correctly (refer to the instructions.txt file).
//  - Specified the correct domain name in the openssl-san.cnf file before running the commands.


 */
