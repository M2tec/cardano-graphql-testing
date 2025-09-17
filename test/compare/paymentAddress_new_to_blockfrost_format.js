import fs from "fs";
import path from 'path'

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function transformPaymentAddress(graphqlResponse) {
  if (!graphqlResponse.paymentAddresses || graphqlResponse.paymentAddresses.length === 0) {
    return null; // no data
  }

  const payment = graphqlResponse.paymentAddresses[0]; // take the first address
  const address = payment.address;

  let amount = payment.summary.assetBalances.map(({ asset, quantity }) => {
    if (!asset.assetId) {
      // Native ADA (tADA -> lovelace)
      return {
        unit: "lovelace",
        quantity
      };
    }

    // Native asset: use assetId directly
    return {
      unit: asset.assetId,
      quantity
    };
  });

  // Sort: lovelace first, then rest alphabetically
  amount.sort((a, b) => {
    if (a.unit === "lovelace") return -1;
    if (b.unit === "lovelace") return 1;
    return a.unit.localeCompare(b.unit);
  });

  return { address, amount };
}

let address = "addr_test1qqtu7g3e7pqwt9f4dqlkme9qj80cejr5v0jwugthywvgjyyxn4dgcgtv9swlj6snz3cdx59ru4u7mhrvg5rl50wunlls5z3e57"

// Read input JSON
// const inputPath = path.join(__dirname, "../", "new", "results", "paymentAddress", `${address}.json` );
// console.log("i", inputPath)

const outputDir = path.join(__dirname, "results", "paymentAddress");

// const rawData = fs.readFileSync(inputPath, "utf8");
// const graphqlData = JSON.parse(rawData);

// Transform
// const result = transformPaymentAddress(graphqlData);

// Write output
// fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

const inputDir = path.join(__dirname, "../", "new", "results", "paymentAddress" );


// Read all .json files in the folder
fs.readdirSync(inputDir).forEach(file => {
  if (path.extname(file) === ".json") {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    try {
      const rawData = fs.readFileSync(inputPath, "utf8");
      const graphqlData = JSON.parse(rawData);

      const result = transformPaymentAddress(graphqlData);

      if (result) {
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
        console.log(`✅ Processed: ${file}`);
      } else {
        console.warn(`⚠️ No paymentAddresses found in ${file}`);
      }
    } catch (err) {
      console.error(`❌ Error processing ${file}:`, err.message);
    }
  }
});


console.log(`✅ Transformation complete. Result written to ${outputPath}`);
