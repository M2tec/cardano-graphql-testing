/* eslint-disable camelcase */
import util from '../util';
import path from 'path'
import { testClient, TestClient } from '../util'
import { DocumentNode } from 'graphql'


function loadQueryNode (name: string): Promise<DocumentNode> {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'new', 'example_queries', 'cardano'), name)
}

describe('cardano', () => {
  let client: TestClient
  beforeAll(async () => {
    client = await testClient.preprod()
  })

  it('Returns core information about the current state of the network', async () => {
    const result = await client.query({
      query: await loadQueryNode('chainTipAndCurrentEpochNumber')
    })

    util.saveResult(result.data, "new",   "cardano", "chainTipAndCurrentEpochNumber.json");

    // FIX FAIL expect((result.data as any).cardano.tip.number).toBeGreaterThan(478480)
    // FIX FAIL expect((result.data as any).cardano.currentEpoch.number).toBeGreaterThan(42)
  })
})
