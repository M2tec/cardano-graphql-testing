import path from 'path'
import fs from 'fs'

import util from '../util';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import DeepDiff from "deep-diff";

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

    it(`Checking differences between new and blockfrost transaction hashes for address: ${address}`, async () => {

      let newFile = path.resolve(__dirname, '..', 'gamechanger-new', 'results', 'transactions', `${address}_hashlist.json`)
      let blockfrostFile = path.resolve(__dirname, '..', 'blockfrost', 'results', 'transactions', `${address}_hash.json`)

      let newData = JSON.parse(fs.readFileSync(newFile, 'utf8'))
      let blockfrostData = JSON.parse(fs.readFileSync(blockfrostFile, 'utf8'))

      const differences = DeepDiff.diff(newData, blockfrostData);

      if (differences) {

        console.log("Diff: ", differences)

        util.saveResult(differences, "compare", "transactions", `${address}_hash_differences.json`);
      }

      expect(newData).toEqual(blockfrostData)

    })

  }

})
