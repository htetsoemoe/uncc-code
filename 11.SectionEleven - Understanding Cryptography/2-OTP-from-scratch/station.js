const fs = require("fs");

const key = fs.readFileSync("./key");

// Imagine that the key is now deleted from the file system once both entities have a copy

let keyOffset = 0;

// Decrypt with one-time pad encryption
function decrypt(ciphertext) {
    if (keyOffset + ciphertext.length > key.length) {
        return console.error("Key length not enough to decrypt this message.");
    }

    const plaintext = Buffer.alloc(ciphertext.length);

    // Loop through the data and decrypt each byte
    for (let i = 0; i < plaintext.length; i++) {
        plaintext[i] = ciphertext[i] ^ key[keyOffset + i]; // XOR
        key[keyOffset + i] = 0; // destroy the used part of the key
    }

    keyOffset += ciphertext.length;

    return plaintext;
}

// Put the encrypted messages from commander.js here
const ciphertext1 = Buffer.from("<grab-ciphertext-from-terminal>", "hex");
const ciphertext2 = Buffer.from("<grab-ciphertext-from-terminal>", "hex");

const plaintext1 = decrypt(ciphertext1);
const plaintext2 = decrypt(ciphertext2);
console.log(plaintext1.toString("utf8"));
console.log(plaintext2.toString("utf8"));
