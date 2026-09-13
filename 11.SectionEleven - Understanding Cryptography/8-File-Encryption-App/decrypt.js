const fs = require("node:fs");
const crypto = require("node:crypto");
const { pipeline } = require("node:stream");

// Our Master Password. Using a Key Management System (KMS) like AWS Secrets Manager is far more secure than environment variables.
// WARNING: Do not hardcode fallback passwords in real-world applications like we are doing here with "nonSecurePassword"!
const password = process.env.FE_PASSWORD || "nonSecurePassword";

const algorithm = "aes-256-gcm";

const fd = fs.openSync("./data.enc", "r");
const fileSize = fs.fstatSync(fd).size;

const salt = Buffer.alloc(16);
const iv = Buffer.alloc(12);
const authCode = Buffer.alloc(16);

/**
 * First 16 bytes: Salt
 * Second 12 bytes: IV
 * Everything here: Ciphertext
 * Last 16 bytes: Message Authentication Code
 */

fs.readSync(fd, salt, 0, 16, 0);
fs.readSync(fd, iv, 0, 12, 16);
fs.readSync(fd, authCode, 0, 16, fileSize - 16);

console.log("Salt:", salt.toString("hex"));
console.log("IV:", iv.toString("hex"));
console.log("MAC:", authCode.toString("hex"));

crypto.pbkdf2(password, salt, 1_000_000, 32, "sha512", (err, key) => {
  if (err) return console.error(err);

  const cipher = crypto.createDecipheriv(algorithm, key, iv);

  // Set the MAC for verification
  cipher.setAuthTag(authCode);

  const input = fs.createReadStream("./data.enc", {
    start: 28, // excluding the salt and IV
    end: fileSize - (16 + 1), // excluding the MAC
  });
  const plaintext = fs.createWriteStream("data_decrypted.txt");

  pipeline(input, cipher, plaintext, (err) => {
    if (err) return console.error(err);

    console.log("Decryption completed and authentication tag verified.");
  });
});
