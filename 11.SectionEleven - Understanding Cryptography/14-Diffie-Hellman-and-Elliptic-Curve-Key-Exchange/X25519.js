const crypto = require("crypto");

// X25519 is a specific implementation of ECDH and is one of the most modern key exchange algorithms.

const serverKeys = crypto.generateKeyPairSync("x25519"); // 255-bit key. Cannot change key size
const serverPublicKey = serverKeys.publicKey;
const serverPrivateKey = serverKeys.privateKey;

const clientKeys = crypto.generateKeyPairSync("x25519");
const clientPublicKey = clientKeys.publicKey;
const clientPrivateKey = clientKeys.privateKey;

const serverSecret = crypto.diffieHellman({
  privateKey: serverPrivateKey,
  publicKey: clientPublicKey,
});

const clientSecret = crypto.diffieHellman({
  privateKey: clientPrivateKey,
  publicKey: serverPublicKey,
});

console.log(serverSecret.equals(clientSecret));
