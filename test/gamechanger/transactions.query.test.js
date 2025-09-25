import path from 'path'
import fs from 'fs'

import util from '../util';
import { testClient } from '../util'

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

import DeepDiff from "deep-diff";

const API = new BlockFrostAPI({
  projectId: "preprodreHl1IQCz3Jbnt3seOXd95c5Jxr9MEO7", 
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
    client = await testClient.preprod()


  });

  for (const address of addresList) {

    it(`Compare blockfrost data for address: ${address}`, async () => {

      console.log(`Querying transactions: ${address}`);

      // const graphqlAddressData = await client.query({
      //   query: await loadQueryNode('transactions'),
      //   variables: { addresses: [address] }
      // })

      // util.saveResult(graphqlAddressData.data, "gamechanger", "transactions", `${address}_graphql.json`);
      
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

      const blockfrostTransactionData = await API.addressesTransactions(address);

      util.saveResult(blockfrostTransactionData, "gamechanger", "transactions", `${address}_blockfrost.json`);

      // expect(blockfrostTipData.slot.toString()).toBe(graphqlAddressData.data.cardano[0].tip.slotNo);
      // expect(blockfrostStripped).toEqual(gqlBlockfrostData);
    })

  }

})
