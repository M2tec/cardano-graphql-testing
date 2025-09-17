/* eslint-disable camelcase */
import util from '../util';
import path from 'path'
import { testClient, TestClient } from '../util'
import { DocumentNode } from 'graphql'


function loadQueryNode (name: string): Promise<DocumentNode> {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'orig', 'example_queries', 'collateral_outputs'), name)
}

describe('collateralOutputs', () => {
  let client: TestClient
  beforeAll(async () => {
    client = await testClient.preprodOrig()
  })

  it('can return an array of collateral outputs', async () => {
    const result = await client.query({
      query: await loadQueryNode('collateralOutputs'),
      variables: {
        limit: 1
      }
    })

    util.saveResult(result.data, "orig", "collateral_outputs", "collateralOutputs.json");

    expect((result.data as any).collateralOutputs[0].address).not.toBeNull()
    expect((result.data as any).collateralOutputs[0].value).not.toBeNull()
    expect((result.data as any).collateralOutputs[0].transaction).not.toBeNull()
  })

  it('can return aggregated data', async () => {
    const result = await client.query({
      query: await loadQueryNode('collateralOutputsAggregate')
    })

    util.saveResult(result.data, "orig", "collateral_outputs", "collateralOutputsAggregate.json");

    expect((result.data as any).collateralOutputs_aggregate.aggregate.max.value).not.toBeNull()
    expect((result.data as any).collateralOutputs_aggregate.aggregate.min.value).not.toBeNull()
    expect((result.data as any).collateralOutputs_aggregate.aggregate.sum.value).not.toBeNull()
  })
})
