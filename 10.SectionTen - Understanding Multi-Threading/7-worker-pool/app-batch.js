const Pool = require("./pool");
const { performance } = require("perf_hooks");

const numWorkers = 4;
const pool = new Pool(numWorkers);

let result = [];
let tasksDone = 0;
const totalTasks = 10_000;
const batchSize = 1_000;
let batchIndex = 0;
const start = performance.now();

let submitTotalCount = 1; // want to know how many times submitBatch function was invoked

function submitBatch(startIndex, endIndex) {
    let batchTaskCount = 0;

    console.log(`${submitTotalCount++} in submitBatch()`);

    for (let i = startIndex; i < endIndex; i++) {
        batchTaskCount++;

        pool.submit(
            "generatePrimes",
            {
                count: 20,
                start: 10_000 + i * 500,
                format: true,
                log: false,
            },
            (primes) => {

                tasksDone++;
                batchTaskCount--;

                // If going with a gigantic totalTask, make sure to change this line to keep the event loop utilization low (the concat function will get time consuming with big arrays).
                // You could try saving the result to a file instead, maybe after each batch is done, and then set the result back to an empty array.
                result = result.concat(primes);

                // When all tasks are done
                if (tasksDone === totalTasks) {
                    console.log(`Time taken: ${performance.now() - start}ms`);
                    console.log(result.sort());
                    process.exit(0);
                }

                // When all batch tasks are done
                if (batchTaskCount === 0) {
                    batchIndex++;
                    submitNextBatch();
                }
            }
        );
    }
}

function submitNextBatch() {
    if (batchIndex * batchSize < totalTasks) {
        const startIndex = batchIndex * batchSize;
        const endIndex = Math.min((batchIndex + 1) * batchSize, totalTasks);
       
        console.log(`startIndex: ${startIndex}, endIndex: ${endIndex} from submitNextBatch()`);

        submitBatch(startIndex, endIndex);
    }
}

// Start the first batch
submitNextBatch();


/**
node app-batch.js

OUTPUT:

startIndex: 0, endIndex: 1000 from submitNextBatch()
1 in submitBatch()
startIndex: 1000, endIndex: 2000 from submitNextBatch()
2 in submitBatch()
startIndex: 2000, endIndex: 3000 from submitNextBatch()
3 in submitBatch()
startIndex: 3000, endIndex: 4000 from submitNextBatch()
4 in submitBatch()
startIndex: 4000, endIndex: 5000 from submitNextBatch()
5 in submitBatch()
startIndex: 5000, endIndex: 6000 from submitNextBatch()
6 in submitBatch()
startIndex: 6000, endIndex: 7000 from submitNextBatch()
7 in submitBatch()
startIndex: 7000, endIndex: 8000 from submitNextBatch()
8 in submitBatch()
startIndex: 8000, endIndex: 9000 from submitNextBatch()
9 in submitBatch()
startIndex: 9000, endIndex: 10000 from submitNextBatch()
10 in submitBatch()
Time taken: 3605.376381ms
[
  '1,000,003', '1,000,033', '1,000,037', '1,000,039', '1,000,081',
  '1,000,099', '1,000,117', '1,000,121', '1,000,133', '1,000,151',
  '1,000,159', '1,000,171', '1,000,183', '1,000,187', '1,000,193',
  '1,000,199', '1,000,211', '1,000,213', '1,000,231', '1,000,249',
  '1,000,507', '1,000,537', '1,000,541', '1,000,547', '1,000,577',
  '1,000,579', '1,000,589', '1,000,609', '1,000,619', '1,000,621',
  '1,000,639', '1,000,651', '1,000,667', '1,000,669', '1,000,679',
  '1,000,691', '1,000,697', '1,000,721', '1,000,723', '1,000,763',
  '1,001,003', '1,001,017', '1,001,023', '1,001,027', '1,001,041',
  '1,001,069', '1,001,081', '1,001,087', '1,001,089', '1,001,093',
  '1,001,107', '1,001,123', '1,001,153', '1,001,159', '1,001,173',
  '1,001,177', '1,001,191', '1,001,197', '1,001,219', '1,001,237',
  '1,001,501', '1,001,527', '1,001,531', '1,001,549', '1,001,551',
  '1,001,563', '1,001,569', '1,001,587', '1,001,593', '1,001,621',
  '1,001,629', '1,001,639', '1,001,659', '1,001,669', '1,001,683',
  '1,001,687', '1,001,713', '1,001,723', '1,001,743', '1,001,783',
  '1,002,017', '1,002,049', '1,002,061', '1,002,073', '1,002,077',
  '1,002,083', '1,002,091', '1,002,101', '1,002,109', '1,002,121',
  '1,002,143', '1,002,149', '1,002,151', '1,002,173', '1,002,191',
  '1,002,227', '1,002,241', '1,002,247', '1,002,257', '1,002,259',
  ... 199900 more items
]
 */