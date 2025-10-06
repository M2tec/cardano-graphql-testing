import path from 'path'
import fs from 'fs'

import util from '../util';
import { testClient } from '../util'

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

import sortObject from 'sort-object-keys';

import sortKeys from 'sort-keys'

// import DeepDiff from "deep-diff";

import { diffString, diff } from 'json-diff';

import { getConfig } from './../config';
const config = await getConfig();
console.log("API:", config.keys.blockfrost)

const API = new BlockFrostAPI({
  projectId: config.keys.blockfrost,

});

function stableSortDeep(value) {
  if (Array.isArray(value)) {
    // Sort each element first
    value = value.map(stableSortDeep);
    // Then sort array elements by their stable string form
    value.sort(function(a, b) {
      var sa = stableStringify(a);
      var sb = stableStringify(b);
      return sa < sb ? -1 : sa > sb ? 1 : 0;
    });
    return value;
  } else if (value && typeof value === 'object') {
    // Sort object values recursively
    var sorted = {};
    Object.keys(value).sort().forEach(function(k) {
      sorted[k] = stableSortDeep(value[k]);
    });
    return sorted;
  } else {
    // Primitive (string, number, null, etc.)
    return value;
  }
}

// Reuse stableStringify from before
function stableStringify(obj) {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(stableStringify).join(',') + ']';
  var keys = Object.keys(obj).sort();
  return '{' + keys.map(function(k) {
    return JSON.stringify(k) + ':' + stableStringify(obj[k]);
  }).join(',') + '}';
}





function replaceString(obj, findStr, replaceStr) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // Use split/join to safely replace all occurrences of arbitrary strings
      obj[key] = obj[key].split(findStr).join(replaceStr);
      // Or, if you prefer regex (for more advanced patterns), you can use:
      // obj[key] = obj[key].replace(new RegExp(findStr, 'g'), replaceStr);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      replaceString(obj[key], findStr, replaceStr); // recursive
    }
  }
}

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

function normalizeCardanoResponse(data) {
  if (data && Array.isArray(data.cardano) && data.cardano.length === 1) {
    data.cardano = data.cardano[0];
  }
  return data;
}

describe('transactions', () => {
  let client

  beforeAll(async () => {
    client = await testClient.preprod()


  });

  for (const address of addresList) {

    it(`Compare blockfrost data for address: ${address}`, async () => {

      console.log(`Querying transactions: ${address}`);

      let origFile = path.resolve(__dirname, '..', 'gamechanger', 'results', 'transactions_postgraphile', `${address}_orig.json`)
      let gqlFile = path.resolve(__dirname, '..', 'gamechanger', 'results', 'transactions_postgraphile', `${address}_graphql.json`)

      let origData = JSON.parse(fs.readFileSync(origFile, 'utf8'))
      let postgraphileData = JSON.parse(fs.readFileSync(gqlFile, 'utf8'))

      replaceString(postgraphileData, ".000000", "Z");
      replaceString(postgraphileData, "TokenInOutput", "Token");
      replaceString(postgraphileData, "TokenMint", "Token");
      replaceString(postgraphileData, "TokenAsset", "Asset");
      replaceString(postgraphileData, "TIMELOCK", "timelock");

      var normalized = normalizeCardanoResponse(postgraphileData);
      
      // var sortedGql = sortKeys(postgraphileData, {deep: true})
      var sortedGql = sortObject(postgraphileData)

      // Example:
      var normalizedGql = stableSortDeep(sortedGql);

      util.saveResult(normalizedGql, "gamechanger", "transactions_postgraphile", `${address}_postgraphile_fix.json`);

      // var sortedOrig = sortKeys(origData, {deep: true})
      var sortedOrig = sortObject(origData)

      var normalizedOrig = stableSortDeep(sortedOrig);

      util.saveResult(normalizedOrig, "gamechanger", "transactions_postgraphile", `${address}_orig_fix.json`);

      const differences = diff(normalizedOrig, normalizedGql);

      util.saveResult(differences, "gamechanger", "transactions_postgraphile", `${address}_differences.json`);


    })

  }

})
