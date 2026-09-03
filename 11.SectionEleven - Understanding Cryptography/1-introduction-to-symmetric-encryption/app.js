const crypto = require("crypto");

// Using AES to encrypt
const cipher = "aes-128-ecb";

// Our key which is 16 bytes (128 bits) === <Buffer 4e 2b a6 d3 4b af f5 32 ee 26 bb bb 16 d3 4b af>
const key = Buffer.from("4e2ba6d34baff532ee26bbbb16d34baf", "hex");

function encrypt(plaintext) {
    const encryptor = crypto.createCipheriv(cipher, key, null);
    const ciphertext = Buffer.concat([
        encryptor.update(plaintext),
        encryptor.final(),
    ]);
    return ciphertext;
}

function decrypt(ciphertext) {
    const decryptor = crypto.createDecipheriv(cipher, key, null);
    const plaintext = Buffer.concat([
        decryptor.update(ciphertext),
        decryptor.final(),
    ]);
    return plaintext;
}

// Our plaintext (original data) === <Buffer 4d 79 20 70 61 73 73 77 6f 72 64 20 69 73 20 68 48 46 32 33 34 36 25 36 32 6e 76 46 57 2e>
const plaintext = Buffer.from("My password is hHF2346%62nvFW.");

// Encrypt the data
const ciphertext = encrypt(plaintext);

// Final plaintext after decryption
const decryptedPlaintext = decrypt(ciphertext);

console.log("Plaintext:", plaintext.toString("utf8"));
console.log("Ciphertext:", ciphertext.toString("utf8"));
console.log("Decrypted Plaintext:", decryptedPlaintext.toString("utf8"));
