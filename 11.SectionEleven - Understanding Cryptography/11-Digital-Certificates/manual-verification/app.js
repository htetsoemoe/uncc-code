const crypto = require("crypto");
const fs = require("fs");

const amazonCertFile = fs.readFileSync("./amazon-cert.pem", "utf8");
const amazonCAFile = fs.readFileSync("./amazon-CA.pem", "utf8");

const amazonCert = new crypto.X509Certificate(amazonCertFile);
const amazonCA = new crypto.X509Certificate(amazonCAFile);

// Grab the signature by running: openssl x509 -in amazon-cert.pem -text -noout
// Amazon signature calculated by the CA is this:
const amazonSignature = Buffer.from(
  "5b606b03565883990476a500f6ce7bba3df3ad1272fbfb0a2d43be15ad0a896f10e2d27ef6870933158ef9dff94d3692db2e89667ab9d7378f506e4c810e69ac47fe3b77b7ba0d262e31716359792aa19c703dd050b09697ee57ec3b08d5bd35f6fbe28b13d4a68aeacc28328ec723e124b4a69ae8492bec3b53462d535a2ca779940656713793be3fd1364316aacfb43b18e4c1887b60c5bfa9e943846f9be02bb35038f24b04a31b4165a97f1d85b083ded390ac54c1644c813e1f065529046c84615a9953d8feaf99e2a62c0926a090acee6040e18081a0aabc2e500cbd06d2e1d674c3011e67e2963110202e4a09620434f21591482948f2f33890ba5fb9",
  "hex"
);

// Grab these by first running: openssl asn1parse -in amazon-cert.pem
// And then the second line is in this format: <offset>:d=1  hl=<headerLength> l=<contentLength> cons: SEQUENCE
const offset = 4;
const headerLength = 4;
const contentLength = 1454;
const amazonCertMessage = amazonCert.raw.subarray(
  offset,
  offset + headerLength + contentLength
);

// ------ Manual Verification ------ //

// Calculate the hash of the certificate
const hash = crypto
  .createHash("sha256")
  .update(amazonCertMessage)
  .digest("hex");

console.log("Computed Hash: ", hash);

// Decrypting the signature
const plaintext = crypto.publicDecrypt(
  { key: amazonCA.publicKey },
  amazonSignature
);

console.log("Decrypted Signature: ", plaintext.subarray(-32).toString("hex"));

// ------ Automatic Verification ------ //

const isValid = crypto.verify(
  "sha256WithRSAEncryption",
  amazonCertMessage,
  amazonCA.publicKey,
  amazonSignature
);

console.log("Valid Signature?", isValid);
