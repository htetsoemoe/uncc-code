const fs = require("node:fs/promises");

(async () => {
    console.time("readBig");
    const fileHandleRead = await fs.open("src.txt", "r");
    const fileHandleWrite = await fs.open("dest.txt", "w");

    const streamRead = fileHandleRead.createReadStream({
        highWaterMark: 64 * 1024, // 64 KB sized buffer
    });
    const streamWrite = fileHandleWrite.createWriteStream();

    let split = "";

    streamRead.on("data", (chunk) => {
        // Use a regex /\s+/ to handle one or more spaces/newlines robustly
        const numbers = chunk.toString("utf-8").split(/\s+/);
        console.log(numbers)

        if (split) {
            numbers[0] = split + numbers[0];
            split = "";
        }

        // Save the last element if it's potentially cut off
        // (Simplified logic for robustness)
        split = numbers.pop();

        numbers.forEach((number) => {
            if (number === "") return; // Skip empty strings from extra spaces
            let n = Number(number);

            if (!isNaN(n) && n % 10 === 0) {
                if (!streamWrite.write(n + " ")) { // backpressure
                    streamRead.pause();
                }
            }
        });
    });

    // When streamWrite buffer empty
    streamWrite.on("drain", () => {
        // resume the streamRead
        streamRead.resume();
    });

    streamRead.on("end", async () => {
        // 1. Properly end the write stream
        streamWrite.end();
    });

    // 2. Wait for the write stream to actually finish writing to disk
    streamWrite.on("finish", async () => {
        // 3. Close the file handles
        await fileHandleRead.close();
        await fileHandleWrite.close();

        console.log("Done reading and writing.");
        console.timeEnd("readBig");
    });
})();

/**
 * 
 
    my dest.txt file has no data after program run
 
    The reason your dest.txt is empty is likely due to how the script handles the file cleanup. 
    In Node.js, when you use fs.open(), you are creating a file descriptor that stays open until you explicitly close it. 
    Because you aren't closing the file handles or the write stream, the data often stays stuck in the internal buffer 
    and never gets "flushed" to the actual disk. 

    Here are the three main reasons why your file is empty and how to fix them:
    
    1. Missing streamWrite.end()
    When the read stream finishes (end), you must tell the write stream that you are done. 
    If you don't call .end(), the stream doesn't know it should finalize the file and 
    flush the last bit of data from memory to the disk.

    2. File Handles are left hanging
    Since you used await fs.open(), you have two open file descriptors. 
    You should close them once the work is done to free up system resources.

    3. The "Double Space" Split Issue
    In your code: .split("  ") (two spaces).
    If your source file only has single spaces between numbers, the split function will return an array with one giant string, 
    the Number() conversions will fail (returning NaN), and the n % 10 === 0 check will never be true.



    $ node readBigSplitting.js 
[
  '1',   '2',  '3',  '4',  '5',  '6',  '7',  '8',  '9',
  '10',  '11', '12', '13', '14', '15', '16', '17', '18',
  '19',  '20', '21', '22', '23', '24', '25', '26', '27',
  '28',  '29', '30', '31', '32', '33', '34', '35', '36',
  '37',  '38', '39', '40', '41', '42', '43', '44', '45',
  '46',  '47', '48', '49', '50', '51', '52', '53', '54',
  '55',  '56', '57', '58', '59', '60', '61', '62', '63',
  '64',  '65', '66', '67', '68', '69', '70', '71', '72',
  '73',  '74', '75', '76', '77', '78', '79', '80', '81',
  '82',  '83', '84', '85', '86', '87', '88', '89', '90',
  '91',  '92', '93', '94', '95', '96', '97', '98', '99',
  '100',
  ... 900 more items
]
Done reading and writing.
readBig: 16.123ms
 */