const crypto = require("node:crypto");

const iv = Buffer.from("31766e6a64736b366867667263766e6a", "hex"); // 16 bytes (128 bits)

const ciphertext = Buffer.from(
  "533ca8922246f1880e88bfe0aff83d8e622a1d264f3be4343e6aa9a4270db62b81adb0b8878b1641536c82d9323a0379051563fa05888ccd21422dc97a044cad2238518eee77355fc387aeac54a9631fb2505bbfcf2dd7908cd4d861c1bdbcc6b12d6285948a6d9b33a154ac3c71aae2431acd6c00c9a2db5a052ca3048cd4ae4066cd1e6dd3ae7d9db502be37939fcda9ec027a7a53b36b8a954697f80f462b65667af421981c6f372a80d2f9abe1ae47be0cf057cc0ab547898aecd1f8635fa9c0952aed24603f75358a51e9cfa5d109bbe5b9b8ddc8aebfec3ae2466d35b4b10ac0ebe786440dfc840066c4989e0e694efa3f524702dc064d95b32858e6026075f2ac769a9b94edb4bfa581100481a227dd8122a2a28905ee90800c1fab2c46ec86805d3aeb3f30529d2becac2c6ada7e87dce754d5d92529e1a84ff9fbfd2f57608646cd30b1e4c9d4c9d5699ce523bc1369669e027a6105722d93e0cab1bae43102def12274e43786389f201b3886d362161b4a89acd260b4650eadad0982e5d5276bfbd0146e9da51a5dbf74affe2761024ab702af20ddeb04061a3e732dc1fe7546b14018f720b20e3d3e35997fd7ec56d366d2f47f1768b9104566fb9685058d4dff58c4af2d6e98ad",
  "hex"
);

const key = Buffer.from("646a336564396974356e766667733330", "hex"); // Array Buffer

console.time("16 AES Encryptions");

for (let i = 0x30; i <= 0x3f; i++) {
  console.log(key); // original === <Buffer 64 6a 33 65 64 39 69 74 35 6e 76 66 67 73 33 35>
  console.log(`key[15]: ${key[15]}`); // key[15]: 53, 35 HEX = 53 DEC

  key[15] = i;
  console.log("=========================================");
  console.log("Tried Key: ", key.toString("hex"));
  const cipher = crypto.createDecipheriv("aes-128-ctr", key, iv);
  const plaintextChunk1 = cipher.update(ciphertext);
  const plaintextChunk2 = cipher.final();
  const plaintext = Buffer.concat([plaintextChunk1, plaintextChunk2]);
  console.log("plaintext: ", plaintext.toString("utf-8"));
  console.log("=========================================");
}

console.timeEnd("16 AES Encryptions");
