// const Blockfrost = require("@blockfrost/blockfrost-js");
import { BlockFrostAPI } from '@blockfrost/blockfrost-js'; // using import syntax
import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";

// get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API = new BlockFrostAPI({
  projectId: "preprodreHl1IQCz3Jbnt3seOXd95c5Jxr9MEO7", // see: https://blockfrost.io
});

async function runExample() {


  try {
    // const latestBlock = await API.blocksLatest();
    // const networkInfo = await API.network();
    // const latestEpoch = await API.epochsLatest();

    const inputFile = path.join(__dirname, "../", "address_data_100.csv");

    const addresses = fs
      .readFileSync(inputFile, "utf8")
      .split("\n")
      .map((a) => a.trim())
      .filter(Boolean); // remove empty lines

    console.log(`Found ${addresses.length} addresses`);

    // let address =  "addr_test1qqtu7g3e7pqwt9f4dqlkme9qj80cejr5v0jwugthywvgjyyxn4dgcgtv9swlj6snz3cdx59ru4u7mhrvg5rl50wunlls5z3e57"

    for (const address of addresses) {

        console.log(`Querying: ${address}`);

        const addressData = await API.addresses(address);
        // const pools = await API.pools({ page: 1, count: 10, order: "asc" });

        // console.log("pools", pools);
        console.log("address", address);

        // ensure folder exists
        const resultsDir = path.join(__dirname, "results", "address");
        fs.mkdirSync(resultsDir, { recursive: true });

        // sanitize filename (addresses are long but safe, just in case)
        const filePath = path.join(resultsDir, `${address}.json`);

        fs.writeFileSync(filePath, JSON.stringify(addressData, null, 2), "utf8");

    }
  } catch (err) {
    console.log("error", err);
  }
}

runExample();