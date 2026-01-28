// Buffer's one element can store 8 bit = 1 byte
// we can store 0 to 255

const { Buffer } = require('buffer')
const memoryContainer = Buffer.alloc(4) // 4 bytes (32 bits)

memoryContainer[0] = 0xf4
memoryContainer[1] = 0x34
memoryContainer[2] = 0x00
memoryContainer[3] = 0xff

console.log(memoryContainer)
console.log(memoryContainer[0])
console.log(memoryContainer[1])
console.log(memoryContainer[2])
console.log(memoryContainer[3])

console.log(memoryContainer.toString('hex'))

/**

<Buffer f4 34 00 ff>
244
52
0
255
f43400ff

 */

// const buff = Buffer.from([0x48, 0x69, 0x21])
// console.log(buff.toString('utf8'))
// Hi!

// const buff = Buffer.from("486921", "hex")
// console.log(buff.toString('utf8'))
// Hi!

// const buff = Buffer.from("Hi!", "utf-8")
// console.log(buff)
// <Buffer 48 69 21> 	 

const buff = Buffer.from("EAA7B7", "hex")
console.log(buff.toString('utf8'))
// ꧷