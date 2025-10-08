import path from 'path'

import util from '../util';
import { testClient } from '../util'

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import { getConfig } from './../config';
const config = await getConfig();

function loadQueryNode(name) {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'gamechanger', 'example_queries', 'transactions'), name)
}

function loadTestOperationDocument(name) {
  return util.loadQueryNode(path.resolve(__dirname, 'graphql_operations'), name)
}


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
    // util.saveResult(graphqlAddressTxData, "gamechanger", "transactions_postgraphile", `${address}_txHistory.json`);
    // console.log("Transaction history:", graphqlAddressTxData);

    // Adjust depending on API response structure
    const txHashes = graphqlAddressTxData.data.transactions.map(tx => tx.hash);
    // console.log(txHashes)

    if (!txHashes.length) {
      console.log("No transactions found for address", address);
      return;
    }

    return txHashes
  }

  for (const address of config.data.addressList) {

    it(`Generate original result json for address: ${address}`, async () => {
      let txHashes = await getTxHistory(address);

      const graphqlAddressData = await origClient.query({
        query: await loadQueryNode('transactions_original'),
        variables: {
          where: { hash: { _in: txHashes } },
          order_by: { includedAt: "asc" }
        }
      });

      util.saveResult(graphqlAddressData.data, "gamechanger", "transactions_postgraphile", `${address}_orig.json`);
      })

  }
})
