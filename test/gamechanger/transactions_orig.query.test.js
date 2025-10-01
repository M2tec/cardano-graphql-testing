import path from 'path'
import fs from 'fs'

import util from '../util';
import { testClient } from '../util'

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

import DeepDiff from "deep-diff";

import { getConfig } from './../config';
const config = await getConfig();
console.log("API:", config.keys.blockfrost)

const API = new BlockFrostAPI({
  projectId: config.keys.blockfrost,
});

import BigNumber from 'bignumber.js'


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
  let client

  beforeAll(async () => {
    client = await testClient.preprodOrig()
  });

  for (const address of addresList) {

    it(`Compare blockfrost data for address: ${address}`, async () => {

      console.log(`Querying transactions: ${address}`);

      const graphqlAddressData = await client.query({
        query: await loadQueryNode('transactions_original'),
        variables: {
          "where": {
            "hash": {
              "_in": [
                      "ffe6ba4ba5c27d48496bc334c1f7e6d1f12fd95bcaf2d03637b23944bb63f017",
                      "cc06efdd929dbf739893d9c88577f13f61edc0d1db9a0414106fb9d351ab33dc",           
                      "34bb391769ee5e203a07ac3c4ed46372412e0faa1b471f2c5f8f8a3842348a13",
                      "48e52efb0f8a363fbf052b8e6b59ef9f30a44f0bcac76e530bff82f9a7c7d51f"        
                    ]
              }
          },    
          "order_by": {"includedAt": "asc"}
          }

        })


      util.saveResult(graphqlAddressData.data, "gamechanger", "transactions_postgraphile", `${address}_orig.json`);

      // let gqlBlockfrostData = util.graphqlToBlockfrost(graphqlAddressData.data)

      // util.saveResult(gqlBlockfrostData, "gamechanger", "paymentAddress", `${address}_gql_blockfrost.json`);


      // // Query Blockfrost data 

      // const blockfrostAddressData = await API.addresses(address);

      // util.saveResult(blockfrostAddressData, "gamechanger", "paymentAddress", `${address}_blockfrost.json`);

      // let blockfrostStripped = util.blockfrostRemoveEnding(blockfrostAddressData)

      // util.saveResult(blockfrostStripped, "gamechanger", "paymentAddress", `${address}_blockfrost_stripped.json`);

      // const differences = DeepDiff.diff(gqlBlockfrostData, blockfrostAddressData);

      // // console.log(differences);

      // if (differences) {
      //   util.saveResult(differences, "gamechanger", "paymentAddress", `${address}_differences.json`);
      // }

      // const blockfrostTransactionData = await API.addressesTransactions(address);

      // util.saveResult(blockfrostTransactionData, "gamechanger", "transactions_postgraphile", `${address}_blockfrost.json`);

      // expect(blockfrostTipData.slot.toString()).toBe(graphqlAddressData.data.cardano[0].tip.slotNo);
      // expect(blockfrostStripped).toEqual(gqlBlockfrostData);
    })

  }

})
