/* eslint-disable camelcase */
import util from '../util';
import path from 'path'
import { testClient, TestClient } from '../util'
import { DocumentNode } from 'graphql'


function loadQueryNode (name: string): Promise<DocumentNode> {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'orig', 'example_queries', 'rewards'), name)
}

describe('rewards', () => {
  let client: TestClient
  beforeAll(async () => {
    client = await testClient.preprodOrig()
  })

  it('can return details for rewards scoped to an address', async () => {
    const result = await client.query({
      query: await loadQueryNode('rewardsForAddress'),
      variables: { limit: 5, offset: 4, where: { address: { _eq: 'stake_test1uqvvzkxjzdu62l4nmcth7j0za6hragkyx8hgs6ywpk9mx0ggzmtey' } } }
    })
    
    util.saveResult(result.data, "orig", "rewards", "rewardsForAddress.json");

    const { rewards } = (result.data as any)
    expect(rewards.length).toBeGreaterThan(4)
    expect(rewards[0].stakePool.hash).toBeDefined()
    expect(rewards[0].earnedIn.number).toBeDefined()
    expect(rewards[0].receivedIn.number).toBeDefined()
    expect(rewards[0].type).toBeDefined()
  })

  it('can return aggregated data on all delegations', async () => {
    const result = await client.query({
      query: await loadQueryNode('aggregateRewards')
    })

    util.saveResult(result.data, "orig", "rewards", "aggregateRewards.json");

    const { rewards_aggregate } = (result.data as any)
    expect(parseInt(rewards_aggregate.aggregate.max.amount)).toBeDefined()
    expect(parseInt(rewards_aggregate.aggregate.min.amount)).toBeDefined()
    expect(parseInt(rewards_aggregate.aggregate.sum.amount)).toBeDefined()
    expect(parseInt(rewards_aggregate.aggregate.count)).toBeGreaterThan(6000)
  })
})
