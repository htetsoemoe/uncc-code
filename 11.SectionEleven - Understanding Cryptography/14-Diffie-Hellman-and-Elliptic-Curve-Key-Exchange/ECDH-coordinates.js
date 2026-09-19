const crypto = require("node:crypto");

// Parse coordinates from public keys
function parsePublicKey(pubKey) {
  // Uncompressed format: 0x04 - X (32 bytes) - Y (32 bytes)
  if (pubKey[0] !== 0x04) throw new Error("Key format should be uncompressed.");
  const x = pubKey.subarray(1, 33).toString("hex");
  const y = pubKey.subarray(33).toString("hex");
  return { x, y };
}

const curve = "secp256k1";
const server = crypto.createECDH(curve);
const client = crypto.createECDH(curve);

const serverPublicKey = server.generateKeys();
const clientPublicKey = client.generateKeys();

// Fixed generator G for secp256k1. This is our starting point on the curve.
const generatorG = {
  x: "79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798",
  y: "483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8",
};

console.log("Curve:", curve);
console.log("Starting point coordinates:");
console.log("X:", generatorG.x);
console.log("Y:", generatorG.y);

const serverPoint = parsePublicKey(serverPublicKey);
const clientPoint = parsePublicKey(clientPublicKey);

console.log("\nServer public key (final point) coordinates:");
console.log("X:", serverPoint.x);
console.log("Y:", serverPoint.y);

console.log("\nClient public key (final point) coordinates:");
console.log("X:", clientPoint.x);
console.log("Y:", clientPoint.y);

// Compute shared secret
const serverSecret = server.computeSecret(clientPublicKey);
const clientSecret = client.computeSecret(serverPublicKey);

console.log("\nServer's Secret:", serverSecret.toString("hex"));
console.log("Client Secret:", clientSecret.toString("hex"));
