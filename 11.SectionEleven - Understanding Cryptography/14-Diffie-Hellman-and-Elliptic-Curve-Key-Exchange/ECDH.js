const crypto = require("node:crypto");

const server = crypto.createECDH("prime256v1"); // 256-bit key
const serverPublicKey = server.generateKeys();
const serverPrivateKey = server.getPrivateKey();

console.log("Server Public Key:");
console.log(serverPublicKey.toString("hex"));

console.log("\nServer Private Key:");
console.log(serverPrivateKey.toString("hex"));

const client = crypto.createECDH("prime256v1");
const clientPublicKey = client.generateKeys();
const clientPrivateKey = client.getPrivateKey();

console.log("\nClient Public Key:");
console.log(clientPublicKey.toString("hex"));

console.log("\nClient Private Key:");
console.log(clientPrivateKey.toString("hex"));

// Exchange and generate the secret...
const serverSecret = server.computeSecret(clientPublicKey);
const clientSecret = client.computeSecret(serverPublicKey);

console.log("\n-------------------------------\n");

console.log("Server's computed secret:");
console.log(serverSecret.toString("hex"));

console.log("\nClient's computed secret:");
console.log(clientSecret.toString("hex"));
