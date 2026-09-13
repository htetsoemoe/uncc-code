const fs = require("node:fs");
const crypto = require("node:crypto");
const { pipeline } = require("node:stream");

/**
 * First 16 bytes: Salt
 * Second 12 bytes: IV
 * Everything here: Ciphertext
 * Last 16 bytes: Message Authentication Code
 */

// Our Master Password. Using a Key Management System (KMS) like AWS Secrets Manager is far more secure than environment variables.
// WARNING: Do not hardcode fallback passwords in real-world applications like we are doing here with "nonSecurePassword"!
const password = process.env.FE_PASSWORD || "nonSecurePassword";

const algorithm = "aes-256-gcm";

const salt = crypto.randomBytes(16); // salt for key derivation function
const iv = crypto.randomBytes(12); // recommended to be 96 bits exactly

console.log("Salt:", salt.toString("hex"));
console.log("IV:", iv.toString("hex"));

crypto.pbkdf2(password, salt, 1_000_000, 32, "sha512", (err, key) => {
  if (err) return console.error(err);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const plaintext = fs.createReadStream("./data.txt");
  const output = fs.createWriteStream("./data.enc"); // salt + IV + ciphertext + MAC

  output.write(salt);
  output.write(iv);

  pipeline(plaintext, cipher, output, (err) => {
    if (err) return console.error(err);

    const authCode = cipher.getAuthTag(); // get the Message Authentication Code (16 bytes)
    console.log("MAC:", authCode.toString("hex"));
    fs.appendFileSync("./data.enc", authCode);
    console.log("Encryption completed and authentication tag written.");
  });
});

/*
  --------------------------------
          Salt (16 bytes)
  --------------------------------
          IV (12 bytes)
  --------------------------------





          Cipher_text          
          (Any Size)




  --------------------------------
          MAC (16 bytes)            
  --------------------------------
*/