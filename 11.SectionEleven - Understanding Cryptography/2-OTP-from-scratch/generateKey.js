// Run this file first to generate a key

const crypto = require("crypto");
const fs = require("fs");

const key = crypto.randomBytes(100); // 100 bytes (800 bits) of truly random data

fs.writeFileSync("./key", key);
