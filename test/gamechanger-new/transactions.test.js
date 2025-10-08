import path from 'path'
import fs from 'fs'

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

describe('transactions', () => {
  let client

  beforeAll(async () => {
    client = await testClient.preprod()
  });

  for (const address of config.data.addressList) {

    it(`Generate postgraphile result json for address: ${address}`, async () => {

      const graphqlAddressData = await client.query({
        query: await loadQueryNode('transactions_postgraphile_tip'),
        // query: await loadQueryNode('transactions_postgraphile_hash'),
        variables: {
          "where": {
            "outputs": {
              "_some": {
                "address": {
                  "_in": [address]
                }
              }
            }
          }
        }
      })

      util.saveResult(graphqlAddressData.data, "gamechanger", "transactions_postgraphile", `${address}_postgraphile.json`);

    })

  }

})
