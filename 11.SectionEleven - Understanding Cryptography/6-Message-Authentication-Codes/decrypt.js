const crypto = require("node:crypto");
const fs = require("node:fs");
const { pipeline } = require("node:stream");

const key = Buffer.from("0123456789abcdef", "utf-8"); // 128-bit, a terrible key!
// const key = crypto.randomBytes(16); // This is how keys should be generated!

const iv = Buffer.from("0123456789abcdef", "utf-8"); // 128 bits, a horrible way to generate an IV!
// const iv = crypto.randomBytes(16); // This is how it should be done in production

const cipher = crypto.createDecipheriv("aes-128-ctr", key, iv);

const ciphertext = fs.createReadStream("./ciphertext.enc");
const plaintext = fs.createWriteStream("./plaintext-decrypted.txt");

// Checking integrity and authentication
const ciphertextForHmac = fs.readFileSync("./ciphertext.enc");
const hmac = crypto
  .createHmac("sha256", key)
  .update(ciphertextForHmac)
  .digest("hex");
console.log("HMAC of ciphertext:", hmac);

pipeline(ciphertext, cipher, plaintext, (err) => {
  if (err) return console.error("Pipeline failed: ", err);
  console.log("Decryption completed.");
});
