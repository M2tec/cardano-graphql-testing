/* eslint-disable camelcase */
import util from '../util';
import path from 'path'
import { testClient, TestClient } from '../util'
import { DocumentNode } from 'graphql'


function loadQueryNode (name: string): Promise<DocumentNode> {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'orig', 'example_queries', 'scripts'), name)
}

describe('scripts', () => {
  let client: TestClient
  beforeAll(async () => {
    client = await testClient.preprodOrig()
  })

  it('can return an array of timelock scripts', async () => {
    const result = await client.query({
      query: await loadQueryNode('timelockScripts'),
      variables: {
        limit: 1
      }
    })

    util.saveResult(result.data, "orig", "scripts", "timelockScripts.json");

    expect((result.data as any).scripts[0].hash).not.toBeNull()
    expect((result.data as any).scripts[0].serialisedSize).toBeNull()
    expect((result.data as any).scripts[0].transaction).not.toBeNull()
    expect((result.data as any).scripts[0].type).not.toBeNull()
  })

  it('can return an array of plutus scripts', async () => {
    const result = await client.query({
      query: await loadQueryNode('plutusScripts'),
      variables: {
        limit: 1
      }
    })

    util.saveResult(result.data, "orig", "scripts", "plutusScripts.json");

    expect((result.data as any).scripts[0].hash).not.toBeNull()
    expect((result.data as any).scripts[0].serialisedSize).not.toBeNull()
    expect((result.data as any).scripts[0].transaction).not.toBeNull()
    expect((result.data as any).scripts[0].type).not.toBeNull()
  })

  it('can return aggregated data', async () => {
    const result = await client.query({
      query: await loadQueryNode('scriptsAggregate')
    })

    util.saveResult(result.data, "orig", "scripts", "scriptsAggregate.json");

    expect((result.data as any).scripts_aggregate.aggregate.max.serialisedSize).not.toBeNull()
    expect((result.data as any).scripts_aggregate.aggregate.min.serialisedSize).not.toBeNull()
    expect((result.data as any).scripts_aggregate.aggregate.sum.serialisedSize).not.toBeNull()
  })
})
