const crypto = require("node:crypto");

const hashFunction = crypto.createHash("sha256");

console.log(crypto.getHashes());

hashFunction.update("Hello");
hashFunction.update("Some more text");
const digest = hashFunction.digest("hex");

console.log(digest);
