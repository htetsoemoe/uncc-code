const crypto = require("node:crypto");

const password = "my_password";

const salt = crypto.randomBytes(32);
const iterations = 1000000;
const keyLength = 64; // 512 bits of data
const digest = "sha512";

// This is what happens behind the scenes in the PBKDF2 function.
// The HMAC function run count will be based on the number of iterations, and the number of blocks needed.
// const blockIndex = Buffer.alloc(4);
// blockIndex.writeUInt32BE(1, 0);

// const hmac = crypto
//   .createHmac(digest, password)
//   .update(Buffer.concat([salt, blockIndex]))
//   .digest("hex");

// console.log("Hmac output:", hmac);

// Password-Based Key Derivation Function 2 (PBKDF2) implementation
console.time("PBKDF2");

crypto.pbkdf2(
  password,
  salt,
  iterations,
  keyLength,
  digest,
  (err, derivedKey) => {
    if (err) console.error(err);

    console.log("Derived Key:", derivedKey.toString("hex"));
    console.timeEnd("PBKDF2");

    // Now use the key to do AES-256 encryption...
    // Save the derivedKey + salt to our database, for password hashing
  }
);
