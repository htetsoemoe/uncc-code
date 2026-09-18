const tls = require("tls");
const fs = require("fs");

console.log(
  `We have ${tls.rootCertificates.length} trusted root CAs as follows:`
);

fs.writeFileSync("./random-cert.pem", tls.rootCertificates[49]);

tls.rootCertificates.forEach((pem, i) => {
  console.log(`CA ${i + 1}: \n${pem}\n`);
});
