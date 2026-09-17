// This server wants to share an AES key with the client.
// Imagine everything in this server folder is in the private space
// of the server (e.g. the server's disk)

const crypto = require("crypto");
const fs = require("fs");

// const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
//   modulusLength: 2048, // in bits
//   publicKeyEncoding: {
//     type: "spki",
//     format: "pem",
//   },
//   privateKeyEncoding: {
//     type: "pkcs8",
//     format: "pem",
//   },
// });

// fs.writeFileSync("./server/server-private.pem", privateKey);
// fs.writeFileSync("./server/server-public.pem", publicKey);

const privateKeyPem = fs.readFileSync("./server/server-private.pem");
const publicKeyPem = fs.readFileSync("./server/server-public.pem");

const publicKey = crypto.createPublicKey({
  key: publicKeyPem,
  format: "pem",
});

const plaintext = Buffer.alloc(256); // in bytes
const plaintextHex = "5468697320697320736f6d652074657874"; // This is some text
plaintext.write(
  plaintextHex,
  256 - Buffer.byteLength(plaintextHex, "hex"),
  "hex"
);

console.log(plaintext.toString("hex"));

const ciphertext = crypto.publicEncrypt(
  { key: publicKey, padding: crypto.constants.RSA_NO_PADDING },
  plaintext
);

console.log("Ciphertext: ", ciphertext.toString("hex"));

// const receivedEncryptedSharedSecretData = Buffer.from(
//   "2ed62510db69484546671451d363dbe52b64946f013977822d123b0a9d9a0d612d53cdd5aa39a06491bd465c6a3019359eed8ce3247e1abce4e0a6457ffe29aee54a06efa90536bb45d87c4db4ba2067b2edb3e0b3d0e114966176084d7307b9fb59a32bac73e9b4da275abc431ae95fba2d45bdadb248908bb567d06b04973f",
//   "hex"
// );

// const privateKey = crypto.createPrivateKey({
//   key: privateKeyPem,
//   format: "pem",
// });

// const sharedSecretData = crypto.privateDecrypt(
//   { key: privateKey },
//   receivedEncryptedSharedSecretData
// );

// console.log(sharedSecretData);
