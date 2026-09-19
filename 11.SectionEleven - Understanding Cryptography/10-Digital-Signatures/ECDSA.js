const crypto = require("crypto");

console.log(crypto.getCurves());

const curve = "secp256k1";

const { privateKey, publicKey } = crypto.generateKeyPairSync("ec", {
  namedCurve: curve,
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

console.log(
  `ECDSA curve ${curve} signature size is ${signature.length * 8} bits.`
);

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
