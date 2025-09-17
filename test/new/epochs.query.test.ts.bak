/* eslint-disable camelcase */
import util from '../util';
import path from 'path'
import { testClient, TestClient } from '../util'
import { DocumentNode } from 'graphql'

import gql from 'graphql-tag'

function loadQueryNode (name: string): Promise<DocumentNode> {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'new', 'example_queries', 'epochs'), name)
}

describe('epochs', () => {
  let client: TestClient
  beforeAll(async () => {
    client = await testClient.preprod()
  })

  // it('Returns epoch details by number', async () => {
  //   const result = await client.query({
  //     query: await loadQueryNode('epochDetailsByNumber'),
  //     variables: { number: 42 }
  //   })

  //   util.saveResult(result.data, "new",   "epochs", "epochDetailsByNumber.json");

  //   // FIX FAIL expect((result.data as any)).toMatchSnapshot()
  // })

  // it('Includes protocol params in effect for the epoch', async () => {
  //   const result = await client.query({
  //     query: await loadQueryNode('epochProtocolParams'),
  //     variables: { number: 42 }
  //     // FIX FAIL variables: { where: { number: { _eq: 42 } } }
  //   })

  //   util.saveResult(result.data, "new",   "epochs", "epochProtocolParams.json");

  //   expect((result.data as any)).toMatchSnapshot()
  // })

  // it('Can return aggregated data', async () => {
  //   const result = await client.query({
  //     query: await loadQueryNode('aggregateDataWithinEpoch'),
  //     variables: {
  //       orderBy: { number: 'asc' },
  //       where: { number: { _in: [1, 42] } }
  //     }
  //   })

  //   util.saveResult(result.data, "new",   "epochs", "aggregateDataWithinEpoch.json");
    
  //   expect((result.data as any)).toMatchSnapshot()
  // })

  it('Can return filtered aggregated data', async () => {
    const result = await client.query({
      query: await loadQueryNode('numberOfBlocksProducedByLeaderInEpoch'),
      variables: { number: 42, slotLeader: 'ByronGenesis-0df4205606dcb8ad' }
    })

    util.saveResult(result.data, "new",   "epochs", "numberOfBlocksProducedByLeaderInEpoch.json");

    expect((result.data as any)).toMatchSnapshot()
  })

  // it('Returns epoch details by number range', async () => {
  //   // Todo: Convert this into an actual ranged query now the performance issue is resolved.
  //   const result = await client.query({
  //     query: await loadQueryNode('epochDetailsInRange'),
  //     variables: { numbers: [42] }
  //   })

  //   util.saveResult(result.data, "new",   "epochs", "epochDetailsInRange.json");

  //   expect((result.data as any)).toMatchSnapshot()
  // })

  // it('Can return aggregated Epoch data', async () => {
  //   const result = await client.query({
  //     query: await loadQueryNode('aggregateEpochData'),
  //     variables: { epochNumberLessThan: 30 }
  //   })

  //   util.saveResult(result.data, "new",   "epochs", "aggregateEpochData.json");

  //   expect((result.data as any)).toMatchSnapshot()
  // })

  // it('Returns blocks scoped to epoch', async () => {
  //   const validQueryResult = await client.query({
  //     query: await loadQueryNode('blocksInEpoch'),
  //     variables: { number: 1, blockLimit: 1 }
  //   })
  //   const invalidQueryResult = await client.query({
  //     query: gql`query {
  //         epochs( where: { number: { _eq: 1 }}) {
  //             blocks(limit: 20, where: { epoch: { number: { _eq: 0 } }}) {
  //                 hash
  //             }
  //         }
  //     }`
  //   })

  //   util.saveResult(validQueryResult.data, "new",   "epochs", "blocksInEpoch-valid.json");
  //   util.saveResult(invalidQueryResult.data, "new",   "epochs", "blocksInEpoch-invalid.json");


  //   expect((validQueryResult.data as any).epochs[0].blocks[0].epoch.number).toBe(1)
  //   expect((invalidQueryResult.data as any).epochs[0].blocks.length).toBe(0)
  // })
})
