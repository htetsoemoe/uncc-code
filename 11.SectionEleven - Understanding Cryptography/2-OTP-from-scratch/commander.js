const fs = require("fs");

const key = fs.readFileSync("./key");

console.log("Key:");
console.log(key.toString("hex"));

// Imagine that the key is now deleted from the file system once both entities have a copy

let keyOffset = 0;

// Encrypt with one-time pad encryption
function encrypt(plaintext) {
    if (keyOffset + plaintext.length > key.length) {
        return console.error("Key length not enough to encrypt this message.");
    }

    const ciphertext = Buffer.alloc(plaintext.length);

    // Loop through the data and encrypt each byte
    for (let i = 0; i < plaintext.length; i++) {
        ciphertext[i] = plaintext[i] ^ key[keyOffset + i]; // XOR
        key[keyOffset + i] = 0; // destroy the used part of the key
    }

    keyOffset = keyOffset + plaintext.length;

    return ciphertext;
}

const msg1 = Buffer.from("Commander Hendrick: Stand by to launch.");
const msg2 = Buffer.from(
    "Commander Hendrick: Terminate operation immediately."
);

const msg1Encrypted = encrypt(msg1);
const msg2Encrypted = encrypt(msg2);

console.log("\nEncrypted Message 1:");
console.log(msg1Encrypted.toString("hex"));
console.log("\nEncrypted Message 2:");
console.log(msg2Encrypted.toString("hex"));
