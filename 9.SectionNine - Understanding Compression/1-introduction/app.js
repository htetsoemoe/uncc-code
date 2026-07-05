const zlib = require("zlib");
const fs = require("fs");

const src = fs.createReadStream("./text-gangatic.txt");
const dest = fs.createWriteStream("./text-compress.txt");

src.pipe(zlib.createInflate()).pipe(dest);

// zlib.createGunzip();
