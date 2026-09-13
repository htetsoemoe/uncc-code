const crypto = require("node:crypto");
const fs = require("node:fs");
const { pipeline } = require("node:stream");

const key = Buffer.from("0123456789abcdef", "utf-8"); // 128-bit, a terrible key!
// const key = crypto.randomBytes(16); // This is how keys should be generated!

const iv = Buffer.from("0123456789abcdef", "utf-8"); // 128 bits, a horrible way to generate an IV!
// const iv = crypto.randomBytes(16); // This is how it should be done in production

const cipher = crypto.createCipheriv("aes-128-gcm", key, iv);

const plaintext = fs.createReadStream("./plaintext.txt");
const ciphertext = fs.createWriteStream("./ciphertext.enc");

pipeline(plaintext, cipher, ciphertext, (err) => {
  if (err) return console.error("Pipeline failed: ", err);
  console.log("Encryption completed.");

  // Additional authentication data
  // cipher.setAAD("email: myemail@company.com")

  console.log(cipher.getAuthTag());
  console.log(cipher.getAuthTag().toString("hex"));
});
