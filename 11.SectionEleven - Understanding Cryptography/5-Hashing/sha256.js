/**
 * Implementation of the SHA-256 algorithm from scratch for educational purposes.
 */

const crypto = require("crypto"); // only need this to make sure our own hash function gives us the correct sha256 hashes

/**
 * This function rotates 32 bits of data circularly.
 *
 * Example: rotateRight(79, 8)
 * 79 in binary is this:                             0000 0000 0000 0000 0000 0000 0100 1111
 * After rotating to the right by 8 bits circularly: 0100 1111 0000 0000 0000 0000 0000 0000
 *
 * Example: rotateRight(0x40, 2)
 * Input:  0000 0000 0000 0000 0000 0000 0100 0000
 * Output: 0000 0000 0000 0000 0000 0000 0001 0000
 */
function rotateRight(value, shift) {
  return (value >>> shift) | (value << (32 - shift));
}

/**
 * This function pads a message to be divisible by 512 bits.
 * We follow these 3 simple steps to make our message 512 bits:
 *  1- Add the binary 1000 0000 (0x80) after the message.
 *  2- Add zeros until the last block of data reaches 448 bits.
 *  3- Add the length of the message in the last 64 bits of the data.
 *
 * Example: padMessage(Buffer.from("Hello", "utf-8"))
 * The binary value of "Hello" in UTF-8 is: 0x48656c6c6f which is 40 bits.
 * Step 1: The binary 1000 0000 (0x80) gets added to the message so we'll end up with:  0x48656c6c6f80 (48 bits)
 * Step 2: We add enough zeros to the message until the total length reaches 448 bits:  0x48656c6c6f800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
 * Step 3: We add the length of the original data (which is 40 bits in this case) to the end of the result, so we'll add 0x0000000000000028 to the end of the message and end up with this: 0x48656c6c6f8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000028
 *
 * Example: padMessage(Buffer.from("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "utf-8"))
 * Notice that the message is exactly 512 bits.
 * Output: 0x6161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616180000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200
 */
function padMessage(buffer) {
  const originalDataLength = buffer.length * 8; // in bits

  const totalLengthSoFar =
    buffer.length + 1 /* for 0x80 */ + 8; /* for length */
  const remainder = totalLengthSoFar % 64;

  // Step 2, finding out how many zeros we need
  const paddingZerosNeeded = (64 - remainder) % 64;
  const zeroPadding = Buffer.alloc(paddingZerosNeeded, 0);

  // Step 3. We need this to be exactly 64 bits, thats why we can't simply do lengthBuffer.write(originalDataLength)
  const lengthBuffer = Buffer.alloc(8);
  lengthBuffer.writeUInt32BE(Math.floor(originalDataLength / 2 ** 32), 0);
  // In JavaScript, >>> 0 is a common trick to convert a number into a 32-bit unsigned integer
  lengthBuffer.writeUInt32BE(originalDataLength >>> 0, 4);

  // Putting everything together: original message + 0x80 + zero-padding + length (8 bytes)
  return Buffer.concat([
    buffer,
    Buffer.from([0x80]), // Step 1
    zeroPadding,
    lengthBuffer,
  ]);
}

/**
 * SHA256 always works with 64-byte (512-bit) blocks and outputs 256 bits of data, regardless of the size of the message.
 * The message size could be as small as 1 bit or as large as 10 terabytes, but the resulting hash will ALWAYS be 256 bits.
 */
function sha256(input) {
  /**
   * Step 1: Initialize 8 hash values (32 bits each).
   * These values are derived from the fractional parts of the square roots of the first 8 primes (2, 3, 5, 7, 11, 13, 17, 19).
   * We will keep updating each of these values and then at the end combine all of them to get our final hash that is 8 * 32 = 512 bits (64 bytes) of data exactly.
   */
  const H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
    0x1f83d9ab, 0x5be0cd19,
  ];

  /**
   * Step 2: The 64 round constants, used exactly once each round.
   * These values are derived from the fractional parts of the cube roots of the first 64 prime numbers.
   *
   * Example: First number - 0x428a2f98
   * 1: Cube root of the first prime number that is 2 is this: Math.cbrt(2) = 1.2599210498948732
   * 2: We take the fraction and multiply by 2^32: 2**32 * 0.259921049894873 = 1116352408.8404639
   * 3: We floor the previous result and convert to hex and that's it 1116352408 = 0x428A2F98
   */
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  // Step 3: Preprocess (pad) the input message
  const paddedMessage = padMessage(input);

  // Split the data into 512-bit (64-byte) chunks
  const chunks = [];
  for (let i = 0; i < paddedMessage.length; i += 64) {
    chunks.push(paddedMessage.slice(i, i + 64));
  }

  // Step 4: Process each chunk
  for (const chunk of chunks) {
    // Prepare the message schedule array W
    const W = new Array(64);

    // Break chunk into 16 32-bit words
    for (let i = 0; i < 16; i++) {
      W[i] = chunk.readUInt32BE(i * 4);
    }

    // Extend the 16 words into the remaining 48
    for (let i = 16; i < 64; i++) {
      const s0 =
        rotateRight(W[i - 15], 7) ^
        rotateRight(W[i - 15], 18) ^
        (W[i - 15] >>> 3);
      const s1 =
        rotateRight(W[i - 2], 17) ^
        rotateRight(W[i - 2], 19) ^
        (W[i - 2] >>> 10);
      W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
    }

    // Initialize 8 working variables from our current hash values H.
    let [a, b, c, d, e, f, g, h] = H;

    // The main compression function. We run this 64 times, updating (a, b, c, d, e, f, g, h) each time.
    for (let i = 0; i < 64; i++) {
      const S1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[i] + W[i]) >>> 0;

      const S0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    // Add this chunk's hash to result so far
    H[0] = (H[0] + a) >>> 0;
    H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0;
    H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0;
    H[5] = (H[5] + f) >>> 0;
    H[6] = (H[6] + g) >>> 0;
    H[7] = (H[7] + h) >>> 0;
  }

  // Step 5: Produce the final 256-bit (32-byte) hash
  return H.map((value) => value.toString(16).padStart(8, "0")).join("");
}

// Compare our function with Node.js Crypto
const data = Buffer.from(
  "This is some random strIng and more and more and more.",
  "utf-8"
);

const hash = sha256(data);
console.log("Our SHA-256 Implementation Hash:");
console.log(hash);

const nodeHash = crypto.createHash("sha256").update(data).digest("hex");
console.log("\nNode.js Crypto Hash:");
console.log(nodeHash);
