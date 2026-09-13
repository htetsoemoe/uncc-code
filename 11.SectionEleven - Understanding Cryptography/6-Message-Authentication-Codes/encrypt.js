const crypto = require("node:crypto");
const fs = require("node:fs");
const { pipeline } = require("node:stream");

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

  const ciphertextForHmac = fs.readFileSync("./ciphertext.enc");

  // Calculate the HMAC (Hash-based Message Authentication Code) of the ciphertext with SHA-256
  const hmac = crypto
    .createHmac("sha256", key)
    .update(ciphertextForHmac)
    .digest("hex");

  console.log("HMAC of ciphertext:", hmac);
});
