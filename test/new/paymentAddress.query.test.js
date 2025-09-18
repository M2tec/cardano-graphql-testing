import path from 'path'
import fs from 'fs'

import util from '../util';
import { testClient } from '../util'

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

const API = new BlockFrostAPI({
  projectId: "preprodreHl1IQCz3Jbnt3seOXd95c5Jxr9MEO7", 
});

const __dirname = dirname(fileURLToPath(import.meta.url));

import BigNumber from 'bignumber.js'


function loadQueryNode(name) {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'new', 'example_queries', 'paymentAddress'), name)
}

function loadTestOperationDocument(name) {
  return util.loadQueryNode(path.resolve(__dirname, 'graphql_operations'), name)
}

// Find big wallets
// SELECT address
// FROM (
//     SELECT address,
//            COUNT(*) AS cnt,
//            ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) AS seqnum
//     FROM cardano_graphql."Utxo"
//     GROUP BY address
// ) ranked
// LIMIT 1000;


let addresList
const inputFile = path.join(__dirname, "../", "address_data_3.csv");

addresList = fs
  .readFileSync(inputFile, "utf8")
  .split("\n")
  .map((a) => a.trim())
  .filter(Boolean); // remove empty lines

console.log("Addresses:", addresList)

describe('paymentAddress', () => {
  let client

  beforeAll(async () => {
    client = await testClient.preprod()


  });

  // it('returns payment address summary for the provided addresses', async () => {
  //   const anyUtxoResult = await client.query({
  //     query: await loadTestOperationDocument('getAnyUtxoAddress'),
  //     variables: { qty: 2 }
  //   })

  //   util.saveResult(anyUtxoResult.data, "orig", "paymentAddress", "getAnyUtxoAddress.json");

  //   const address1 = anyUtxoResult.data.utxos[0].address

  //   // const result = await client.query({
  //   //   query: await loadQueryNode('summary'),
  //   //   variables: { addresses: [address1] }
  //   // })

  //   // util.saveResult(result.data, "orig", "paymentAddress", "summary.json");

  //   // const paymentAddress = result.data.paymentAddresses[0]
  //   // expect(paymentAddress.summary.assetBalances[0].asset.assetId).toBeDefined()
  //   // expect(new BigNumber(paymentAddress.summary.assetBalances[0].quantity).toNumber())
  //   //   .toBeGreaterThan(0)
  // })

  for (const address of addresList) {

    it(`Address summary for: ${address}`, async () => {

      console.log(`Querying: ${address}`);

      const graphqlAddressData = await client.query({
        query: await loadQueryNode('summary'),
        variables: { addresses: [address] }
      })

      util.saveResult(graphqlAddressData.data, "new", "paymentAddress", `${address}_graphql.json`);
      
      let gqlBlockfrostData = util.graphqlToBlockfrost(graphqlAddressData.data)

      util.saveResult(gqlBlockfrostData, "new", "paymentAddress", `${address}_gql_blockfrost.json`);

      const blockfrostAddressData = await API.addresses(address);

      util.saveResult(blockfrostAddressData, "new", "paymentAddress", `${address}_blockfrost.json`);
      
      

      // const paymentAddress = result.data.paymentAddresses[0]
      // expect(paymentAddress.summary.assetBalances[0].asset.assetId).toBeDefined()
      // expect(new BigNumber(paymentAddress.summary.assetBalances[0].quantity).toNumber())
      //   .toBeGreaterThan(0)

    })

  }
  // it('can bound the summary by chain length by block number', async () => {
  //   const anyUtxoResult = await client.query({
  //     query: await loadTestOperationDocument('getAnyUtxoAddress'),
  //     variables: { qty: 2 }
  //   })
  //   const utxo = anyUtxoResult.data.utxos[0]
  //   const blockBound = utxo.transaction.block.number - 1
  //   const unboundedResult = await client.query({
  //     query: await loadQueryNode('summary'),
  //     variables: { addresses: [utxo.address] }
  //   })

  //   util.saveResult(unboundedResult.data, "orig", "paymentAddress", "unboundedResult.json");

  //   const boundedResult = await client.query({
  //     query: await loadQueryNode('summary'),
  //     variables: {
  //       addresses: [utxo.address],
  //       atBlock: blockBound
  //     }
  //   })

  //   util.saveResult(boundedResult.data, "orig", "paymentAddress", "boundedResult.json");

  //   const unboundedAdaBalance = new BigNumber(
  //     unboundedResult.data.paymentAddresses[0].summary.assetBalances[0].quantity
  //   ).toNumber()
  //   const boundedAdaBalance = new BigNumber(
  //     boundedResult.data.paymentAddresses[0].summary?.assetBalances[0]?.quantity
  //   ).toNumber() || 0
  //   expect(unboundedAdaBalance).toBeGreaterThan(boundedAdaBalance)
  // })
})
