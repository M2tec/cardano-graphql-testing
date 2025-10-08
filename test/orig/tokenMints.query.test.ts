/* eslint-disable camelcase */
import util from '../util';
import path from 'path'
import { testClient, TestClient } from '../util'
import { DocumentNode } from 'graphql'


function loadQueryNode (name: string): Promise<DocumentNode> {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'orig', 'example_queries', 'token_mints'), name)
}

describe('tokenMints', () => {
  let client: TestClient
  beforeAll(async () => {
    client = await testClient.preprodOrig()
  })

  it('can return information on token minting and burning', async () => {
    const result = await client.query({
      query: await loadQueryNode('tokenMints'),
      variables: {
        limit: 2
      }
    })

    util.saveResult(result.data, "orig", "token_mints", "tokenMints_1.json");

    const { tokenMints_aggregate, tokenMints } = (result.data as any)
    const { aggregate } = tokenMints_aggregate
    expect(aggregate.count).toBeDefined()
    expect(tokenMints.length).toBeGreaterThan(0)
    expect(parseInt(tokenMints_aggregate.aggregate.count)).toBeGreaterThan(0)
    expect(tokenMints[0].asset.fingerprint.slice(0, 5)).toBe('asset')
  })

  it('can return information on assets by fingerprint', async () => {
    const result = await client.query({
      query: await loadQueryNode('tokenMints'),
      variables: {
        where: {
          asset: { fingerprint: { _eq: 'asset132r28qxkhg0wddjjpt2qffzd9m7g37arndlxsv' } }
        },
        limit: 10,
        offset: 0
      }
    })

    util.saveResult(result.data, "orig", "token_mints", "tokenMints_2.json");

    const { tokenMints } = (result.data as any)
    expect(tokenMints[0].quantity).toBeDefined()
    expect(tokenMints[0].transaction.hash).toBeDefined()
    expect(tokenMints[0].asset.assetId).toBeDefined()
    expect(tokenMints[0].asset.fingerprint).toBeDefined()
    expect(tokenMints[0].asset.policyId).toBeDefined()
  })
})
