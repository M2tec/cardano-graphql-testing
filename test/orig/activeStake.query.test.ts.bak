/* eslint-disable camelcase */

import util from '../util';
import path from 'path'
import { testClient, TestClient } from '../util'
import { DocumentNode } from 'graphql'

function loadQueryNode (name: string): Promise<DocumentNode> {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'orig', 'example_queries', 'active_stake'), name)
}

describe('activeStake', () => {
  let client: TestClient
  beforeAll(async () => {
    client = await testClient.preprodOrig()
  })

  it('can return active stake snapshots for an address', async () => {
    const result = await client.query({
      query: await loadQueryNode('activeStakeForAddress'),
      variables: { limit: 5, where: { address: { _eq: 'stake_test1upxue2rk4tp0e3tp7l0nmfmj6ar7y9yvngzu0vn7fxs9ags2apttt' } } }
    })
    const { activeStake } = (result.data as any);

    util.saveResult(result.data, "orig", 'active_stake', "activeStakeForAddress.json");

    expect(activeStake.length).toBe(5)
    expect(activeStake[0].amount).toBeDefined()
    expect(activeStake[0].epochNo).toBeDefined()
    expect(activeStake[0].registeredWith.hash).toBeDefined()
    expect(activeStake[0].stakePoolHash).toBeDefined()
    expect(activeStake[0].stakePoolId).toBeDefined()
  })

  it('can return aggregated active stake information for an address', async () => {
    const result = await client.query({
      query: await loadQueryNode('averageActiveStakeForAddress'),
      variables: { address: 'stake_test1uq4l6kqvvhxywxxae04u4g6uv9sa0yymscuql5an693p53g4qz4rk' }
    })
    const { activeStake_aggregate } = (result.data as any);

    console.log("result.data:", result.data)
    
    util.saveResult(result.data, "orig", 'active_stake', "averageActiveStakeForAddres.json");

    expect(activeStake_aggregate.aggregate.count).toBeDefined()
  })
})
