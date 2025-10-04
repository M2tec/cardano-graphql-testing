import path from 'path'
import fs from 'fs'

import util from '../util';
import { testClient } from '../util'

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));


function loadQueryNode(name) {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'gamechanger', 'example_queries', 'transactions'), name)
}

function loadTestOperationDocument(name) {
  return util.loadQueryNode(path.resolve(__dirname, 'graphql_operations'), name)
}

let addresList
const inputFile = path.join(__dirname, "../", "address_data_1.csv");

addresList = fs
  .readFileSync(inputFile, "utf8")
  .split("\n")
  .map((a) => a.trim())
  .filter(Boolean); // remove empty lines

console.log("Addresses:", addresList)

describe('transactions', () => {
  let origClient
  let postGraphileClient

  beforeAll(async () => {
    origClient = await testClient.preprodOrig()
    postGraphileClient = await testClient.preprod()
  });

  async function getTxHistory(address) {

    // Get improve txHashes data from postgraphile

      const graphqlAddressTxData = await postGraphileClient.query({

        query: await loadQueryNode('transactions_postgraphile_hash'),
        variables: {
          "where": {
            "outputs": {
              "_some": {
                "address": {
                  "_in": [ address ]
                }
              }
            }
          }
        }
      })

    // const data = await response.json();
    util.saveResult(graphqlAddressTxData, "gamechanger", "transactions_postgraphile", `${address}_txHistory.json`);
    // console.log("Transaction history:", graphqlAddressTxData);

    // Adjust depending on API response structure
    const txHashes = graphqlAddressTxData.data.transactions.map(tx => tx.hash);
    console.log(txHashes)

    if (!txHashes.length) {
      console.log("No transactions found for address", address);
      return;
    }

    const graphqlAddressData = await origClient.query({
      query: await loadQueryNode('transactions_original'),
      variables: {
        where: { hash: { _in: txHashes } },
        order_by: { includedAt: "asc" }
      }
    });

    util.saveResult(graphqlAddressData.data, "gamechanger", "transactions_postgraphile", `${address}_orig.json`);
  }



  for (const address of addresList) {

    it(`Compare blockfrost data for address: ${address}`, async () => {

      console.log(`Querying transactions: ${address}`);

      await getTxHistory(address);

      // [
      //                       "ffe6ba4ba5c27d48496bc334c1f7e6d1f12fd95bcaf2d03637b23944bb63f017",
      //                       "cc06efdd929dbf739893d9c88577f13f61edc0d1db9a0414106fb9d351ab33dc",           
      //                       "34bb391769ee5e203a07ac3c4ed46372412e0faa1b471f2c5f8f8a3842348a13",
      //                       "48e52efb0f8a363fbf052b8e6b59ef9f30a44f0bcac76e530bff82f9a7c7d51f"        
      //                     ]

    })

  }
})
