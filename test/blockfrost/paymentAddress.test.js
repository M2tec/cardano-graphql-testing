// const Blockfrost = require("@blockfrost/blockfrost-js");
import { BlockFrostAPI } from '@blockfrost/blockfrost-js'; // using import syntax
import fs from "fs";
import path from "path";

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

describe('address', () => {

  beforeAll(async () => {
  });

  for (const address of config.data.addressList) {

    it(`Generate blockfrost address result json: ${address}`, async () => {

      console.log(`Querying: ${address}`);

      const addressData = await API.addresses(address);
      // const pools = await API.pools({ page: 1, count: 10, order: "asc" });

      util.saveResult(addressData, "blockfrost", "paymentAddress", `${address}.json`);
    })

  }
})

