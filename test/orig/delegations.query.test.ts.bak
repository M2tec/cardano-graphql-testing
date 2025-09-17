/* eslint-disable camelcase */
import util from '../util';
import path from 'path'
import { testClient, TestClient } from '../util'
import { DocumentNode } from 'graphql'

function loadQueryNode (name: string): Promise<DocumentNode> {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'orig', 'example_queries', 'delegations'), name)
}

describe('delegations', () => {
  let client: TestClient
  beforeAll(async () => {
    client = await testClient.preprodOrig()
  })

  it('can return details for stake delegation', async () => {
    const result = await client.query({
      query: await loadQueryNode('delegationSample'),
      variables: { limit: 5 }
    })
    
    util.saveResult(result.data, "orig", "delegations", "delegationSample.json");

    const { delegations } = (result.data as any)
    expect(delegations.length).toBe(5)
    expect(delegations[0].address.slice(0, 5)).toBe('stake')
    expect(delegations[0].stakePool.hash).toBeDefined()
    expect(delegations[0].transaction.block.number).toBeDefined()
  })

  it('can return aggregated data on all delegations', async () => {
    const result = await client.query({
      query: await loadQueryNode('aggregateDelegation')
    })

    util.saveResult(result.data, "orig", "delegations", "aggregateDelegation.json");

    const { delegations_aggregate } = (result.data as any)
    expect(parseInt(delegations_aggregate.aggregate.count)).toBeGreaterThan(900)
  })
})
