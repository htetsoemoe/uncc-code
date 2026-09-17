// This client wants to share an AES key with the server.
// Imagine everything in this client folder is in the private space
// of the client (e.g. the user's laptop)

const crypto = require("crypto");
const fs = require("fs");

const sharedSecretData = crypto.randomBytes(48);

console.log(sharedSecretData);

const serverPublicPem = fs.readFileSync("./server-public.pem");

const serverPublicKey = crypto.createPublicKey({
  key: serverPublicPem,
  format: "pem",
});

const ciphertext = crypto.publicEncrypt(
  { key: serverPublicKey },
  sharedSecretData
);

console.log(ciphertext.toString("hex"));
