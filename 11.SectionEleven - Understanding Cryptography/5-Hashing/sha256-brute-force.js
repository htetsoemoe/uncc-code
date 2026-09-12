const crypto = require("crypto");

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function startsWithPattern(hash, pattern) {
  return hash.startsWith(pattern);
}

// Brute-force function
async function bruteForce(targetPattern) {
  let counter = 0;
  let found = false;

  console.log(
    `Searching for a SHA-256 hash starting with "${targetPattern}"...`
  );

  while (!found) {
    // Generate a unique message by appending the counter
    const message = `data${counter}`;

    const hash = sha256(message);

    // Check if the hash starts with the target pattern
    if (startsWithPattern(hash, targetPattern)) {
      console.log(`\nMatch found!`);
      console.log(`Message: ${message}`);
      console.log(`Hash: ${hash}`);
      console.log(`Total trials: ${counter + 1}`);
      found = true;
      break;
    }

    // Log progress every 1,000,000 trials
    if (counter > 0 && counter % 1000000 === 0) {
      console.log(`Trials: ${counter}`);
    }

    counter++;
  }
}

// Checking if a value is specified
if (process.argv.length < 3) {
  console.error("Please specify a valid hex string as the first argument.");
  process.exit(1);
}

// Command line argument
const toFind = process.argv[2].toLowerCase();

// Checking if the value specified is a valid hex string
if (!/^[0-9a-f]+$/i.test(toFind)) {
  console.error("Please specify a valid hex string as the first argument.");
  process.exit(1);
}

// Start the brute-force process
bruteForce(toFind).catch((err) => {
  console.error("An error occurred:", err);
});
