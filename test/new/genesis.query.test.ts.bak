/* eslint-disable camelcase */
import util from '../util';
import path from 'path'
import { testClient, TestClient } from '../util'
import { DocumentNode } from 'graphql'


function loadQueryNode (name: string): Promise<DocumentNode> {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'new', 'example_queries', 'genesis'), name)
}

describe('genesis', () => {
  let client: TestClient

  beforeAll(async () => {
    client = await testClient.preprod()
  })

  it('Returns key information about the network genesis', async () => {
    const query = { query: await loadQueryNode('keyNetworkInfo') }
    const result = await client.query(query)

    util.saveResult(result.data, "new",   "genesis", "keyNetworkInfo.json");

    expect(result.data).toMatchSnapshot()
  })
})
