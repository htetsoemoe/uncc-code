const crypto = require("node:crypto");
const fs = require("node:fs");

// ***** Uncomment this first to generate the keys: ****  //
/*
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2054, // key size in bits
  publicKeyEncoding: {
    type: "spki", // other option is pkcs1
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8", // other option pkcs1
    format: "pem",
  },
});

console.log(publicKey);
console.log(privateKey);

fs.writeFileSync("private.pem", privateKey);
fs.writeFileSync("public.pem", publicKey);
*/

// ***** Uncomment this after your first run to read the keys: *****  //
/*
const privateKeyPem = fs.readFileSync("private.pem");
const publicKeyPem = fs.readFileSync("public.pem");

const privateKey = crypto.createPrivateKey({
  key: privateKeyPem,
  format: "pem",
});

const publicKey = crypto.createPublicKey({
  key: publicKeyPem,
  format: "pem",
});
*/

const plaintext = Buffer.from("This is my password $#*U(R&FY", "utf8");

const ciphertext = crypto.publicEncrypt({ key: publicKey }, plaintext);

console.log(ciphertext);

const decryptedData = crypto.privateDecrypt({ key: privateKey }, ciphertext);

console.log(decryptedData.toString("utf8"));

// Available Functions for RSA Encryption/Decryption:
// crypto.publicEncrypt
// crypto.privateEncrypt

// crypto.publicDecrypt
// crypto.privateDecrypt
