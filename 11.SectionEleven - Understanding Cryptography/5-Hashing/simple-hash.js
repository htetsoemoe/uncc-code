// A simple hash function for non-cryptographic purposes
function simpleHash(message) {
  const primes = [
    83190383, 32358331, 60631063, 86607347, 74966531, 31244677, 45659557,
    80897737, 91074791, 53041721,
  ];

  for (let i = 0; i < message.length; i++) {
    let temp = message[i] * primes[i % 10];
    message[i] = message[i] ^ temp;
  }

  for (let i = 0; i < message.length; i++) {
    message[i] = message[i] >>> 2; // shift the data to the right by 2 bits
  }

  let result = 0;
  for (let i = 0; i < message.length; i++) {
    result += message[i] * primes[i % 10];
    result = result % 100000000;
  }

  const resultBuffer = Buffer.alloc(4);
  resultBuffer.writeUInt32BE(result, 0);

  return resultBuffer;
}

// Collision: message 1: "wefjwekfigIwej", message 2: "wefjwekfigiwej"

const digest = simpleHash(Buffer.from("Some data to hash", "utf-8"));

console.log(digest.toString("hex"));
