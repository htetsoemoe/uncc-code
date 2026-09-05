const crypto = require("node:crypto");
const fs = require("node:fs");
const { pipeline } = require("node:stream");

// --------------------------- //
// IV means Initialization Vector
//
// ECB: Electronic Codebook
//
// CBC: Cipher Block Chaining (Although Secure but rarely used)
//
// CTR: Counter (Although Secure but rarely used)
// --------------------------- //


// --------------------------- //
// ECB MODE - SIMPLE ENCRYPTION
// --------------------------- //
/*
const key = Buffer.from("0123456789abcdef", "utf-8"); // 128-bit, a terrible key!
// const key = crypto.randomBytes(16); // This is how keys should be generated!

const plaintext = Buffer.from("330f0f0f0f0f0f0f0f0f0f0f0f0f0f0f", "hex");

const cipher = crypto.createCipheriv("aes-128-ecb", key, null);
cipher.setAutoPadding(false);

const cipherChunk1 = cipher.update(plaintext);
const cipherChunk2 = cipher.final();

const ciphertext = Buffer.concat([cipherChunk1, cipherChunk2]);

console.log("Ciphertext: ", ciphertext);
console.log("Plaintext size: ", plaintext.length);
console.log("Ciphertext size: ", ciphertext.length);
console.log(ciphertext.toString("hex"));
*/

// --------------------------- //
// ECB MODE - ENCRYPTION
// --------------------------- //
/*
// head -c 54 plaintext.bmp > header
// tail -c +55 ciphertext.bmp > body
// cat header body > ciphertext-new.bmp

const key = Buffer.from("0123456789abcdef", "utf-8"); // 128-bit, a terrible key!
// const key = crypto.randomBytes(16); // This is how keys should be generated!

const cipher = crypto.createCipheriv("aes-128-ecb", key, null);

const plaintext = fs.createReadStream("./plaintext.txt");
const ciphertext = fs.createWriteStream("./ciphertext.enc");

pipeline(plaintext, cipher, ciphertext, (err) => {
  if (err) return console.error("Pipeline failed: ", err);
  console.log("Encryption completed.");
});
*/

// --------------------------- //
// ECB MODE - DECRYPTION
// --------------------------- //
/*
const key = Buffer.from("0123456789abcdef", "utf-8"); // 128-bit, a terrible key!
// const key = crypto.randomBytes(16); // This is how keys should be generated!

const cipher = crypto.createDecipheriv("aes-128-ecb", key, null);

const ciphertext = fs.createReadStream("./ciphertext.enc");
const plaintext = fs.createWriteStream("./plaintext-decrypted.txt");

pipeline(ciphertext, cipher, plaintext, (err) => {
  if (err) return console.error("Pipeline failed: ", err);
  console.log("Decryption completed.");
});
*/

// --------------------------- //
// CBC MODE - ENCRYPTION
// --------------------------- //
/*
const key = Buffer.from("0123456789abcdef", "utf-8"); // 128-bit, a terrible key!
// const key = crypto.randomBytes(16); // This is how keys should be generated!

const iv = Buffer.from("0123456789abcdef", "utf-8"); // 128 bits, a horrible way to generate an IV!
// const iv = crypto.randomBytes(16); // This is how it should be done in production

const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);

const plaintext = fs.createReadStream("./plaintext.txt");
const ciphertext = fs.createWriteStream("./ciphertext.enc");

pipeline(plaintext, cipher, ciphertext, (err) => {
  if (err) return console.error("Pipeline failed: ", err);
  console.log("Encryption completed.");
});
*/

// --------------------------- //
// CBC MODE - DECRYPTION
// --------------------------- //
/*
const key = Buffer.from("0123456789abcdef", "utf-8"); // 128-bit, a terrible key!
// const key = crypto.randomBytes(16); // This is how keys should be generated!

const iv = Buffer.from("0123456789abcdef", "utf-8"); // 128 bits, a horrible way to generate an IV!
// const iv = crypto.randomBytes(16); // This is how it should be done in production

const cipher = crypto.createDecipheriv("aes-128-cbc", key, iv);

const ciphertext = fs.createReadStream("./ciphertext.enc");
const plaintext = fs.createWriteStream("./plaintext-decrypted.txt");

pipeline(ciphertext, cipher, plaintext, (err) => {
  if (err) return console.error("Pipeline failed: ", err);
  console.log("Decryption completed.");
});
*/

// --------------------------- //
// CTR MODE - ENCRYPTION
// --------------------------- //
/*
const key = Buffer.from("0123456789abcdef", "utf-8"); // 128-bit, a terrible key!
// const key = crypto.randomBytes(16); // This is how keys should be generated!

const iv = Buffer.from("0123456789abcdef", "utf-8"); // 128 bits, a horrible way to generate an IV!
// const iv = crypto.randomBytes(16); // This is how it should be done in production

const cipher = crypto.createCipheriv("aes-128-ctr", key, iv);

const plaintext = fs.createReadStream("./plaintext.txt");
const ciphertext = fs.createWriteStream("./ciphertext.enc");

pipeline(plaintext, cipher, ciphertext, (err) => {
  if (err) return console.error("Pipeline failed: ", err);
  console.log("Encryption completed.");
});
*/

// --------------------------- //
// CTR MODE - DECRYPTION
// --------------------------- //

const key = Buffer.from("0123456789abcdef", "utf-8"); // 128-bit, a terrible key!
// const key = crypto.randomBytes(16); // This is how keys should be generated!

const iv = Buffer.from("0123456789abcdef", "utf-8"); // 128 bits, a horrible way to generate an IV!
// const iv = crypto.randomBytes(16); // This is how it should be done in production

const cipher = crypto.createDecipheriv("aes-128-ctr", key, iv);

const ciphertext = fs.createReadStream("./ciphertext.enc");
const plaintext = fs.createWriteStream("./plaintext-decrypted.txt");

pipeline(ciphertext, cipher, plaintext, (err) => {
  if (err) return console.error("Pipeline failed: ", err);
  console.log("Decryption completed.");
});
