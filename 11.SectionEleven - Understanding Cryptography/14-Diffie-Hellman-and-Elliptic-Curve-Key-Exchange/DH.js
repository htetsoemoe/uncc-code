const crypto = require("crypto");

console.log("------- Server ------- ");

const shared = crypto.createDiffieHellman(3072); // 3072-bit key
const prime = shared.getPrime();
const generator = shared.getGenerator();

console.log("Prime Number: " + prime.toString("hex"));
console.log("\nGenerator: ", generator.toString("hex"));

const server = crypto.createDiffieHellman(prime, generator);
const serverPublicKey = server.generateKeys();
const serverPrivateKey = server.getPrivateKey();

console.log("\nServer Public Key:", serverPublicKey.toString("hex"));
console.log("\nServer Private Key:", serverPrivateKey.toString("hex"));

console.log("\n------- Client ------- ");

// Client uses the same prime and generator to generate a public and private key
const client = crypto.createDiffieHellman(prime, generator);
const clientPublicKey = client.generateKeys();
const clientPrivateKey = client.getPrivateKey();

console.log("Client Public Key:", clientPublicKey.toString("hex"));
console.log("\nClient Private Key:", clientPrivateKey.toString("hex"));

// ----- Key Exchange Process ----- //
console.log("\n------- Computed Secret ------- ");

// Server computes shared secret using client's public key
const serverSecret = server.computeSecret(clientPublicKey);
console.log("Server Secret:", serverSecret.toString("hex"));

// Client computes shared secret using server's public key
const clientSecret = client.computeSecret(serverPublicKey);
console.log("\nClient Secret:", clientSecret.toString("hex"));
