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

function loadTestOperationDocument(name) {
  return util.loadQueryNode(path.resolve(__dirname, 'graphql_operations'), name)
}

function normalizeCardanoResponse(data) {
  if (data && Array.isArray(data.cardano) && data.cardano.length === 1) {
    data.cardano = data.cardano[0];
  }
  return data;
}

describe('transactions', () => {

  for (const address of config.data.addressList) {

    it(`Checking differences between original and postgraphile query for address: ${address}`, async () => {

      let origFile = path.resolve(__dirname, '..', 'gamechanger', 'results', 'transactions_postgraphile', `${address}_orig_normalized.json`)
      let gqlFile = path.resolve(__dirname, '..', 'gamechanger', 'results', 'transactions_postgraphile', `${address}_postgraphile_normalized.json`)

      let origData = JSON.parse(fs.readFileSync(origFile, 'utf8'))
      let postgraphileData = JSON.parse(fs.readFileSync(gqlFile, 'utf8'))

      util.replaceString(postgraphileData, ".000000", "Z");
      util.replaceString(postgraphileData, "TokenInOutput", "Token");
      util.replaceString(postgraphileData, "TokenMint", "Token");
      util.replaceString(postgraphileData, "TokenAsset", "Asset");
      util.replaceString(postgraphileData, "TIMELOCK", "timelock");
      postgraphileData.cardano[0].tip.slotInEpoch = String(postgraphileData.cardano[0].tip.slotInEpoch);

      var normalized = normalizeCardanoResponse(postgraphileData);

      util.saveResult(normalized, "gamechanger", "transactions_postgraphile", `${address}_postgraphile_fix.json`);

      const differences = diff(origData, normalized);

      console.log("Diff: ", differences)

      if (differences) {
        util.saveResult(differences, "gamechanger", "transactions_postgraphile", `${address}_differences.json`);
      }


    })

  }

})
