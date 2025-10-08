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
	return util.loadQueryNode(path.resolve(__dirname, '..', 'gamechanger-orig', 'example_queries', 'assets'), name)
}

describe('assets', () => {
	let client

	beforeAll(async () => {
		client = await testClient.preprodOrig()
	});

	it(`Get asset data by fingerprint`, async () => {

		const graphqlAssetData = await client.query({
			query: await loadQueryNode('assets'),
			// query: await loadQueryNode('transactions_postgraphile_hash'),
			variables: {
				where: {
					fingerprint: {
						_in: [
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
				},
				orderBy: [{ fingerprint: "asc" }]
			}
		})

		util.saveResult(graphqlAssetData.data, "gamechanger-orig", "assets", `assets-fingerprint.json`);

	})


	it(`Get asset data by ID`, async () => {

		const graphqlAssetData = await client.query({
			query: await loadQueryNode('assets_minimal'),
			// query: await loadQueryNode('transactions_postgraphile_hash'),
			variables: {
				where: {
					assetId: {
						_in: ["a330a4b05adbdc70020bfcab81b69b8807322fdf6142712a8f117f4147616d654368616e6765724e4654202332",
							"40e8d69b466f23bc4753a9b2b9ab2533f2c3ef611871086b4da93ef047616d654368616e676572546f6b656ef09f9a80",
							"a330a4b05adbdc70020bfcab81b69b8807322fdf6142712a8f117f4147616d654368616e6765724e4654202333",
							"e732d5c9a42b43afbc0a601c16d80957004c6c8da823a6904e7f5cd047616d654368616e6765724e4654",
							"a330a4b05adbdc70020bfcab81b69b8807322fdf6142712a8f117f4147616d654368616e6765724e4654202331",
							"a330a4b05adbdc70020bfcab81b69b8807322fdf6142712a8f117f417269636b794064726f70636c7562",
							"40e8d69b466f23bc4753a9b2b9ab2533f2c3ef611871086b4da93ef046616b65555344"
						]
					}
				},
				orderBy: [{ fingerprint: "asc" }]
			}
		})

		util.saveResult(graphqlAssetData.data, "gamechanger-orig", "assets", `assets-assetId.json`);

	})
})



