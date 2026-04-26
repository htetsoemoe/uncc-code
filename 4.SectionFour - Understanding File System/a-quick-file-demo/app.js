const fs = require('fs');

const content = fs.readFileSync('./test.txt');
console.log('Buffer: ', content)
console.log('File content:', content.toString());