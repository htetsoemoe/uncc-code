/**
 * Usage:
 *    node xor.js <hexString1> <hexString2>
 *
 * Examples:
 *    node xor.js da77f6289d9f16a7520544111281bc13350afe49f53cd1ba1f5463528b87c98f501be2e11b7c18 99189b45fcf172c220250c747ce5ce7a5661c469bb699aff3f182207c5c481af1356a6db2c3a2a
 *    Commander Hendrick: NUKE LAUNCH CMD:7F2
 *
 *    node xor.js da77f6289d9f16a7520544111281bc13350afe49e81dfb915b38407ee5b0ee8f7f37d3b54f5204 99189b45fcf172c220250c747ce5ce7a5661c469bb699aff3f182207c5c481af1356a6db2c3a2a
 *    Commander Hendrick: Stand by to launch.
 */

// Gets 2 buffers and XORs them (assumes that they have the same length)
function xorBuffers(buf1, buf2) {
  const result = Buffer.alloc(buf1.length);

  for (let i = 0; i < buf1.length; i++) {
    result[i] = buf1[i] ^ buf2[i];
  }

  return result;
}

// Grab the arguments
const hex1 = process.argv[2];
const hex2 = process.argv[3];

// Check if arguments are provided
if (!hex1 || !hex2) {
  console.error("Please provide two hex strings to XOR.");
  console.error("Usage: node xor.js <hexString1> <hexString2>");
  process.exit(1);
}

// Check if arguments are valid hex values
const isValidHex = (str) => /^[0-9a-fA-F]+$/.test(str);

if (!isValidHex(hex1) || !isValidHex(hex2)) {
  console.error("Both arguments must be valid hexadecimal strings.");
  process.exit(1);
}

// Check if arguments have the same length
if (hex1.length !== hex2.length) {
  console.error("Both hexadecimal strings must have the same length.");
  process.exit(1);
}

// Convert each hex value to a buffer
const buf1 = Buffer.from(hex1, "hex");
const buf2 = Buffer.from(hex2, "hex");

// XOR the buffers
const xorResult = xorBuffers(buf1, buf2);

// Run the XORed result through UTF-8
console.log(xorResult.toString("utf-8"));
