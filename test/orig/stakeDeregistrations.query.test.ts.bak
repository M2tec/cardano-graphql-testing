/* eslint-disable camelcase */
import util from '../util';
import path from 'path'
import { testClient, TestClient } from '../util'
import { DocumentNode } from 'graphql'

function loadQueryNode (name: string): Promise<DocumentNode> {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'orig', 'example_queries', 'stake_deregistrations'), name)
}

describe('stakeDeregistrations', () => {
  let client: TestClient
  beforeAll(async () => {
    client = await testClient.preprodOrig()
  })

  it('can return details for stake registrations', async () => {
    const result = await client.query({
      query: await loadQueryNode('stakeDeregistrationsSample'),
      variables: { limit: 5 }
    })

    util.saveResult(result.data, "orig", "stake_deregistrations", "stakeDeregistrationsSample.json");

    const { stakeDeregistrations } = (result.data as any)
    expect(stakeDeregistrations.length).toBe(5)
    expect(stakeDeregistrations[0].transaction.hash).toBeDefined()
  })

  it('can return aggregated data on all stake registrations', async () => {
    const result = await client.query({
      query: await loadQueryNode('aggregateStakeDeregistrations')
    })

    util.saveResult(result.data, "orig", "stake_deregistrations", "aggregateStakeDeregistrations.json");

    const { stakeDeregistrations_aggregate } = (result.data as any)
    expect(parseInt(stakeDeregistrations_aggregate.aggregate.count)).toBeGreaterThan(10)
  })
})
