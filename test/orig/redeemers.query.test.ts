/* eslint-disable camelcase */
import util from '../util';
import path from 'path'
import { testClient, TestClient } from '../util'
import { DocumentNode } from 'graphql'


function loadQueryNode (name: string): Promise<DocumentNode> {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'orig', 'example_queries', 'redeemers'), name)
}

describe('redeemers', () => {
  let client: TestClient
  beforeAll(async () => {
    client = await testClient.preprodOrig()
  })

  it('can return an array of redeemers', async () => {
    const result = await client.query({
      query: await loadQueryNode('redeemers'),
      variables: {
        limit: 1
      }
    })

    util.saveResult(result.data, "orig", "redeemers", "redeemers.json");

    expect((result.data as any).redeemers[0].datum).not.toBeNull()
    expect((result.data as any).redeemers[0].datum.bytes).not.toBeNull()
    expect((result.data as any).redeemers[0].datum.hash).not.toBeNull()
    expect((result.data as any).redeemers[0].datum.firstIncludedIn.hash).not.toBeNull()
    expect((result.data as any).redeemers[0].datum.value).not.toBeNull()
    expect((result.data as any).redeemers[0].fee).not.toBeNull()
    expect((result.data as any).redeemers[0].index).not.toBeNull()
    expect((result.data as any).redeemers[0].purpose).not.toBeNull()
    expect((result.data as any).redeemers[0].scriptHash).not.toBeNull()
    expect((result.data as any).redeemers[0].transaction).not.toBeNull()
    expect((result.data as any).redeemers[0].unitMem).not.toBeNull()
    expect((result.data as any).redeemers[0].unitSteps).not.toBeNull()
  })

  it('can return aggregated data', async () => {
    const result = await client.query({
      query: await loadQueryNode('redeemersAggregate')
    })

    util.saveResult(result.data, "orig", "redeemers", "redeemersAggregate.json");

    expect((result.data as any).redeemers_aggregate.aggregate.max.value).not.toBeNull()
    expect((result.data as any).redeemers_aggregate.aggregate.min.value).not.toBeNull()
    expect((result.data as any).redeemers_aggregate.aggregate.sum.value).not.toBeNull()
  })
})
