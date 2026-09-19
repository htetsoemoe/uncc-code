const crypto = require("crypto");
const fs = require("fs");

const amazonCertFile = fs.readFileSync("./amazon-cert.pem", "utf8");

const amazonCert = new crypto.X509Certificate(amazonCertFile);

console.log(amazonCert);

if (amazonCert.subject === amazonCert.issuer) {
  console.log("Certificate is self-signed.");
} else {
  console.log("Certificate is not self-signed.");
}
