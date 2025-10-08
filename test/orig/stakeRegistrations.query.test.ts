/* eslint-disable camelcase */
import util from '../util';
import path from 'path'
import { testClient, TestClient } from '../util'
import { DocumentNode } from 'graphql'

function loadQueryNode (name: string): Promise<DocumentNode> {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'orig', 'example_queries', 'stake_registrations'), name)
}

describe('stakeRegistrations', () => {
  let client: TestClient
  beforeAll(async () => {
    client = await testClient.preprodOrig()
  })

  it('can return details for stake registrations', async () => {
    const result = await client.query({
      query: await loadQueryNode('stakeRegistrationsSample'),
      variables: { limit: 5 }
    })

    util.saveResult(result.data, "orig", "stake_registrations", "stakeRegistrationsSample.json");

    const { stakeRegistrations } = (result.data as any)
    expect(stakeRegistrations.length).toBe(5)
    expect(stakeRegistrations[0].transaction.hash).toBeDefined()
  })

  it('can return aggregated data on all stake registrations', async () => {
    const result = await client.query({
      query: await loadQueryNode('aggregateStakeRegistrations')
    })

    util.saveResult(result.data, "orig", "stake_registrations", "aggregateStakeRegistrations.json");

    const { stakeRegistrations_aggregate } = (result.data as any)
    expect(parseInt(stakeRegistrations_aggregate.aggregate.count)).toBeGreaterThan(1000)
  })
})
