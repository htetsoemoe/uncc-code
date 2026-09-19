const crypto = require("crypto");

const { privateKey, publicKey } = crypto.generateKeyPairSync("ed25519");

// Me signing a message

const dataToSign = Buffer.from(
  "I owe $2,730 to Dylan with id 2134325, payment due on July 25th.",
  "utf8"
);

const signature = crypto.sign(null, dataToSign, privateKey);

console.log(`ed25519 signature size is ${signature.length * 8} bits.`);

// Third-party verifying my signature

const dataToVerify = Buffer.from(
  "I owe $2,730 to Dylan with id 2134325, payment due on July 25th.",
  "utf8"
);

const isSignatureValid = crypto.verify(
  null,
  dataToVerify,
  publicKey,
  signature
);

console.log(isSignatureValid);
