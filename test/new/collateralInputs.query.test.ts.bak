/* eslint-disable camelcase */
import util from '../util';
import path from 'path'
import { testClient, TestClient } from '../util'
import { DocumentNode } from 'graphql'

function loadQueryNode (name: string): Promise<DocumentNode> {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'new', 'example_queries', 'collateral_inputs'), name)
}

describe('collateralInputs', () => {
  let client: TestClient
  beforeAll(async () => {
    client = await testClient.preprod()
  })

  // FIX FAIL it('can return an array of collateral inputs', async () => {
  //   const result = await client.query({
  //     query: await loadQueryNode('collateralInputs'),
  //     variables: {
  //       limit: 1
  //     }
  //   })

  //   util.saveResult(result.data, "new",   "collateral_inputs", "collateralInputs.json");

  //   expect((result.data as any).collateralInputs[0].address).not.toBeNull()
  //   expect((result.data as any).collateralInputs[0].sourceTransaction).not.toBeNull()
  //   expect((result.data as any).collateralInputs[0].value).not.toBeNull()
  //   expect((result.data as any).collateralInputs[0].transaction).not.toBeNull()
  // })

  it('can return aggregated data', async () => {
    const result = await client.query({
      query: await loadQueryNode('collateralInputsAggregate')
    })

    util.saveResult(result.data, "new",   "collateral_inputs", "collateralInputsAggregate.json");

    expect((result.data as any).collateralInputs_aggregate.aggregate.max.value).not.toBeNull()
    expect((result.data as any).collateralInputs_aggregate.aggregate.min.value).not.toBeNull()
    expect((result.data as any).collateralInputs_aggregate.aggregate.sum.value).not.toBeNull()
  })
})
