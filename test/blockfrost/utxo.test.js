// const Blockfrost = require("@blockfrost/blockfrost-js");
import { BlockFrostAPI } from '@blockfrost/blockfrost-js'; // using import syntax
import fs from "fs";
import path from "path";
import util from '../util';

import { fileURLToPath } from "url";

// get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { getConfig } from './../config';
const config = await getConfig();
console.log("API:", config.keys.blockfrost)

const API = new BlockFrostAPI({
  projectId: config.keys.blockfrost, 
});


let addresList
const inputFile = path.join(__dirname, "../", "address_data_1.csv");

addresList = fs
  .readFileSync(inputFile, "utf8")
  .split("\n")
  .map((a) => a.trim())
  .filter(Boolean); // remove empty lines

console.log("Addresses:", addresList)
// let address =  "addr_test1qqtu7g3e7pqwt9f4dqlkme9qj80cejr5v0jwugthywvgjyyxn4dgcgtv9swlj6snz3cdx59ru4u7mhrvg5rl50wunlls5z3e57"


for (const address of addresList) {

  describe('utxos', () => {

    it(`Compare blockfrost data for address: ${address}`, async () => {

      const utxoData = await API.addressesUtxos(address);

      util.saveResult(utxoData, "blockfrost", "utxo", `${address}_blockfrost.json`);

    })

  })
}

