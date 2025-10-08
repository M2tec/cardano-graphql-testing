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


//   async function classifyTransactions(address, txList) {
//     const results = [];

//     // txList = ['cc06efdd929dbf739893d9c88577f13f61edc0d1db9a0414106fb9d351ab33dc']

//     for (const hash of txList) {

//       const txUtxo = await API.txsUtxos(hash);
//       // console.log("txUtxo: ", txUtxo)

//       // if (!res.ok) throw new Error(`Failed fetching ${hash}`);

//       const inInputs = txUtxo.inputs.some(i => i.address === address);
//       const inOutputs = txUtxo.outputs.some(o => o.address === address);

//       const inputAmt = txUtxo.inputs
//         .filter(i => i.address === address)
//         .reduce(
//           (sum, i) =>
//             sum + Number(i.amount.find(a => a.unit === "lovelace")?.quantity || 0),
//           0
//         );

//       // console.log("inputAmt: ", inputAmt)
//       const outputAmt = txUtxo.outputs
//         .filter(o => o.address === address)
//         .reduce(
//           (sum, o) =>
//             sum + Number(o.amount.find(a => a.unit === "lovelace")?.quantity || 0),
//           0
//         );


//       let type;
//       if (inInputs && !inOutputs) {
//         type = "outgoing";
//       } else if (!inInputs && inOutputs) {
//         type = "incoming";
//       } else if (inInputs && inOutputs) {
//         type = outputAmt > inputAmt ? "incoming" : "outgoing";
//         if (outputAmt === inputAmt) type = "self";
//       } else {
//         type = "unknown";
//       }
//       console.log(hash, type)

//     }



//     // return {
//     //   hash: txUtxo.hash,
//     //   type,
//     //   inputAmt,
//     //   outputAmt,
//     //   netChange: outputAmt - inputAmt
//     // };
  
//   }

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

      // console.log("TxLIst", txList)
    //   const classified = await classifyTransactions(address, txList);
      // console.log(classified);

    })

  }

})
