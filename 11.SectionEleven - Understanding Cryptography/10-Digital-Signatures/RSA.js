const crypto = require("crypto");

const keySize = 3072; // 3072-bit key, signature size also 3072 bits

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: keySize,
});

// Me signing a message

const dataToSign = Buffer.from(
  "I owe $2,730 to Dylan with id 2134325, payment due on July 25th.",
  "utf8"
);

const sign = crypto.createSign("sha256");
sign.update(dataToSign);
sign.end();

// Encrypted digest using the private key
const signature = sign.sign(privateKey);

console.log(`RSA-${keySize} signature size is ${signature.length * 8} bits.`);

// Third-party verifying my signature

const dataToVerify = Buffer.from(
  "I owe $2,730 to Dylan with id 2134325, payment due on July 25th.",
  "utf8"
);

const verify = crypto.createVerify("sha256");
verify.update(dataToVerify);
verify.end();

const isSignatureValid = verify.verify(publicKey, signature);
console.log(isSignatureValid);
