const crypto = require("crypto");

// Same for all 3 KDFs
const password = "my_password";
const salt = crypto.randomBytes(32);
const keyLength = 64; // in bytes

console.log("Password:", password);
console.log("Salt:", salt.toString("hex"));
console.log("Key Length:", keyLength);

// Password-Based Key Derivation Function 2
function demoPBKDF2() {
  const iterations = 1_000_000;
  const digest = "sha512"; // 64 bytes output

  crypto.pbkdf2(
    password,
    salt,
    iterations,
    keyLength,
    digest,
    (err, derivedKey) => {
      if (err) throw err;
      console.log("\n=== PBKDF2 Demo ===");
      console.log("Iterations:", iterations);
      console.log("Digest Algorithm:", digest);
      console.log("Derived Key:", derivedKey.toString("hex"));
    }
  );
}

// A more modern KDF
function demoScrypt() {
  const options = {
    cost: 16384, // Cost factor (must be a power of 2)
    blockSize: 8, // Block size
    parallelization: 1, // Parallelization factor
  };

  crypto.scrypt(password, salt, keyLength, options, (err, derivedKey) => {
    if (err) throw err;
    console.log("\n=== Scrypt Demo ===");
    console.log("Options:", options);
    console.log("Derived Key:", derivedKey.toString("hex"));
  });
}

// HMAC-based Extract-and-Expand Key Derivation Function
function demoHKDF() {
  const info = Buffer.from("Some more data here...");
  const digest = "sha512"; // 64 bytes

  crypto.hkdf(digest, password, salt, info, keyLength, (err, derivedKey) => {
    if (err) throw err;
    console.log("\n=== HKDF Demo ===");
    console.log("Info:", info.toString());
    console.log("Digest Algorithm:", digest);
    console.log("Derived Key:", Buffer.from(derivedKey).toString("hex")); // derivedKey is an ArrayBuffer
  });
}

demoPBKDF2();
demoScrypt();
demoHKDF();
