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
  return util.loadQueryNode(path.resolve(__dirname, '..', 'gamechanger-new', 'example_queries', 'assets'), name)
}

describe('assets', () => {
  let client

  beforeAll(async () => {
    client = await testClient.preprod()
  });

  it(`Get asset data`, async () => {

      const graphqlAssetData = await client.query({
        query: await loadQueryNode('assets'),
        // query: await loadQueryNode('transactions_postgraphile_hash'),
        variables: {
		"where": {
			"fingerprint": {
				"_in": [
					"asset1tsjrncfc92wsyc2hee2w0wpve6l5pqcf62dqdf",
					"asset189sq3uvt2zrv238knkhjfxct40r3vurmk0dfuc",
					"asset1sgmyd0my0madhqm87jxk7aesearex0j587s490",
					"asset10m73lulft4w2h0sjnx3qn92rap48qyn8hzp4l9",
					"asset1ge07knf9apppncvtqtuteta3nlmkn5s6y3nfa4",
					"asset1t56ejjnl4lwd4l35h69965c806p53rqprztf9x",
					"asset1gna02j50ysnz5uultuyejvdw0y5q3cdf55xkjn",
					"ada.ada"
				]
			}
		}
	}
      })

      util.saveResult(graphqlAssetData.data, "gamechanger-new", "assets", `assets.json`);

    })


})
