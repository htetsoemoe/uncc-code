/** The RSA implementation from scratch */

// Like the pow function in python
function pow(base, exponent, modular) {
  base = BigInt(base);
  exponent = BigInt(exponent);
  mod = BigInt(modular);

  // Calculate modular exponentiation using square-and-multiply: (arg1 ^ arg2) % arg3
  if (exponent > 0n) {
    let result = 1n;
    base = ((base % modular) + modular) % modular;
    while (exponent > 0n) {
      if (exponent & 1n) result = (result * base) % modular;
      base = (base * base) % modular;
      exponent >>= 1n;
    }
    return result;
  }

  // Calculate modular inverse using the extended Euclidean algorithm: (arg1 * what_number) % arg3 == 1
  if (exponent === -1n) {
    let a = ((base % modular) + modular) % modular;
    let m = modular,
      x0 = 0n,
      x1 = 1n;
    while (a > 1n && m !== 0n) {
      const q = a / m;
      [a, m] = [m, a % m];
      [x0, x1] = [x1 - q * x0, x0];
    }
    if (a !== 1n) throw new RangeError("Inverse does not exist");
    return ((x1 % modular) + modular) % modular;
  }
}

// Calculate the greatest common divisor between a and b using Euclidean algorithm
function gcd(a, b) {
  while (b !== 0n) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function hexToBigInt(hex) {
  // If no leading "0x" specified, add one before converting
  return BigInt(hex.startsWith("0x") ? hex : "0x" + hex);
}

function printBigInt(label, bn) {
  console.log(`${label} 0x${bn.toString(16)}`);
}

const prime1 = hexToBigInt(
  "00ca0b8a2b763f0ffe06b3b6037e312d69d7009f7d68c602fe2954a4846a26be649baf8a7154e49ac3266d1df9c500c5858db74fa78c707837aa0d35d078ce2682ea5be1b3c4cac42491b7f12953b14aa719cb9fa5a7c5c391e2ffcf55c021516730f82c93a482796f725e2b6860fd7f2c87c889437abdc9b2900f2dbb5cdfbf87"
);
const prime2 = hexToBigInt(
  "00c39a1599042722ed5dd25dcf17aac2d0ee28cc13e023c71a02d03c270ecb8c53cefe34c1244b901d3da310628838fad7e04e4c8305f89afa242bef3fcc6e6d2701eb496c91ace8aaf736c13ab4af6ba0a8aabe89135665f1b2eb5f6fb4ccd6d6a5b004e47155e2d24eafa55524fcecd76c12571367b8db3e69e7d533561430b5"
);
const publicExponent = hexToBigInt("0x10001"); // 65537

// calculate private exponent(d)
const phi = (prime1 - 1n) * (prime2 - 1n);
const privateExponent = pow(publicExponent, -1n, phi);

const modulus = prime1 * prime2;

printBigInt("prime1 =", prime1);
printBigInt("prime2 =", prime2);
printBigInt("privateExponent =", privateExponent);
printBigInt("modulus =", modulus);
printBigInt("publicExponent =", publicExponent);

// Encrypt
const plaintext = hexToBigInt("5468697320697320736f6d652074657874");
const ciphertext = pow(plaintext, publicExponent, modulus);
printBigInt("ciphertext =", ciphertext);

// Decrypt
const decrypted_result = pow(ciphertext, privateExponent, modulus);
printBigInt("decrypted_data =", decrypted_result);
