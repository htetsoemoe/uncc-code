const crypto = require("node:crypto");

const key = Buffer.from("0123456789abcdef", "utf-8"); // 128-bit, a terrible key!
// const key = crypto.randomBytes(16); // This is how keys should be generated!

const plaintext = Buffer.from("330f0f0f0f0f0f0f0f0f0f0f0f0f0f0f231", "hex");

const cipher = crypto.createCipheriv("aes-128-ecb", key, null);
cipher.setAutoPadding(true);

const cipherChunk1 = cipher.update(plaintext);
const cipherChunk2 = cipher.final();

const ciphertext = Buffer.concat([cipherChunk1, cipherChunk2]);

console.log("Ciphertext: ", ciphertext);

console.log("Plaintext: ", plaintext.toString());
console.log("Plaintext size: ", plaintext.length);

console.log("Ciphertext: ", ciphertext.toString());
console.log("Ciphertext size: ", ciphertext.length);
console.log(ciphertext.toString("hex"));

/*
$ node encrypt.js 
Ciphertext:  <Buffer c3 10 c4 fb 8a 9f f2 c1 5d a8 de 25 d5 c8 ca 6d 69 c8 06 c6 ba 26 af 32 c1 b2 68 25 95 03 27 0a>
Plaintext:  3☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼#
Plaintext size:  17
Ciphertext:  �►������]��%���mi�♠ƺ&�2��h%�♥'

Ciphertext size:  32
c310c4fb8a9ff2c15da8de25d5c8ca6d69c806c6ba26af32c1b268259503270a
*/