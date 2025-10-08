import util from '../util';

// import { dirname } from 'node:path';
// import { fileURLToPath } from 'node:url';
// const __dirname = dirname(fileURLToPath(import.meta.url));

import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

import { getConfig } from './../config';
const config = await getConfig();
console.log("API:", config.keys.blockfrost)

const API = new BlockFrostAPI({
  projectId: config.keys.blockfrost,
});

describe('transactions', () => {


  beforeAll(async () => {
  });

  for (const address of config.data.addressList) {

    it(`Generate blockfrost transaction result json for address: ${address}`, async () => {

    //   curl -X GET "https://cardano-testnet.blockfrost.io/api/v0/addressesaddr_test1qzhk0pycq7g5krcl88dfly68r4d8v0qem66tfz0pv3gm284vtuft7q8490g8a8jq6f47sy87gvse82danhchjvjf3ucqsccj6p/transactions" \
    //  -H "project_id: YOUR_BLOCKFROST_PROJECT_ID"


      const blockfrostTransactionData = await API.addressesTransactions(address);

      console.log(blockfrostTransactionData)

      util.saveResult(blockfrostTransactionData, "blockfrost", "transactions", `${address}.json`);

      const txList = Array.isArray(blockfrostTransactionData)
        ? blockfrostTransactionData.map(item => item.tx_hash)
        : (blockfrostTransactionData.data || []).map(item => item.tx_hash);

      txList.sort()

      util.saveResult(txList, "blockfrost", "transactions", `${address}_hash.json`);

    })

  }

})
