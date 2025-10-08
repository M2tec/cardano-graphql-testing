import path from 'path'
import fs from 'fs'

import util from '../util';
import { testClient } from '../util'

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import BigNumber from 'bignumber.js'
import { addresses } from '@blockfrost/blockfrost-js/lib/endpoints/api/addresses';

function loadQueryNode (name) {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'orig', 'example_queries', 'paymentAddress'), name)
}

function loadTestOperationDocument (name){
  return util.loadQueryNode(path.resolve(__dirname, 'graphql_operations'), name)
}

// Find big wallets

// SELECT address, cnt
// FROM (SELECT address, COUNT(*) as cnt,
//              ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as seqnum
//       FROM cardano_graphql."Utxo"
//       GROUP BY address
//      ) ct
// WHERE seqnum = 2;

// SELECT address, COUNT(*) as cnt,
//              ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as seqnum
//       FROM cardano_graphql."Utxo"
//       GROUP BY address
// 	  LIMIT 500



describe('paymentAddress', () => {
  let client
  let addresList
  beforeAll(async () => {
    client = await testClient.preprodOrig() 

    const inputFile = path.join(__dirname, "../", "address_data_100.csv");

    addresList = fs
      .readFileSync(inputFile, "utf8")
      .split("\n")
      .map((a) => a.trim())
      .filter(Boolean); // remove empty lines

      console.log("Addresses:", addresList)
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



  it('returns payment address summary for the provided addresses', async () => {
    
    for (const address of addresList) {
    
        console.log(`Querying: ${address}`);
        
        const result = await client.query({
        query: await loadQueryNode('summary'),
        // variables: { addresses: ["addr_test1wqveypcqsf2xwjn2uusfn2gj5acwd2yxm8rhd3v8cgg7lus3vs0hp"] }
        variables: { addresses: [address] }      
      })

      util.saveResult(result.data, "orig", "paymentAddress", `${address}.json`);

      // const paymentAddress = result.data.paymentAddresses[0]
      // expect(paymentAddress.summary.assetBalances[0].asset.assetId).toBeDefined()
      // expect(new BigNumber(paymentAddress.summary.assetBalances[0].quantity).toNumber())
      //   .toBeGreaterThan(0)
    }
  })


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
