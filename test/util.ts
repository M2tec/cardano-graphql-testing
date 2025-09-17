
import fs from 'fs'

import path from 'path'

import gql from 'graphql-tag'

import pRetry from 'p-retry'
// const  pRetry = require('p-retry').default;

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/server';
import fetch from 'cross-fetch'


import { DocumentNode } from 'graphql'

// import FailedAttemptError from 'p-retry'
// import { dummyLogger, Logger } from 'ts-log'

// export const onFailedAttemptFor = (operation: string, logger: Logger = dummyLogger) => ({ attemptNumber, message, retriesLeft }: InstanceType<typeof FailedAttemptError>) => {
//   const nextAction = retriesLeft > 0 ? 'retrying...' : 'exiting'
//   logger.trace(message)
//   logger.debug(`${operation}: Attempt ${attemptNumber} of ${attemptNumber + retriesLeft}, ${nextAction}`)
//   if (retriesLeft === 0) {
//     logger.error(message)
//     process.exit(1)
//   }
// }

export type TestClient = ApolloClient

export const testClient = {
  mainnet: buildClient.bind(this,
    'http://localhost:3100'
  ),
  preprod: buildClient.bind(this,
    'http://localhost:4000/graphql'
  ),
  preprodOrig: buildClient.bind(this,
    'https://preprod-moonflower.m2tec.nl/cardano-graphql'
  )
}

export  async function createTestApolloClient(
  apiUri: string
)  {

    return new ApolloClient({
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          fetchPolicy: 'network-only',
        },
      },
      link: new HttpLink({
        uri: apiUri,
        fetch,
      }),
      // addTypename: false,
    });
  };

export async function buildClient (
  apiUri: string
) {

    console.log("apiUri: ", apiUri)
    const client = await createTestApolloClient(apiUri)

    await pRetry(async () => {
      const result = await client.query({
        query: gql`query {
        cardanoDbMeta {
            initialized
        }}`
      })
      if ((result.data as any)?.cardanoDbMeta?.initialized === false) {
        console.log("Failure")
        throw new Error(`Cardano DB is not initialized: ${JSON.stringify(result.data)}`)
      } else {
        console.log("Connection: ", result)
      }

      console.log("Retry")
    }
      , {
        factor: 1.75,
        retries: 9,
        // onFailedAttempt: onFailedAttemptFor('Cardano GraphQL Server readiness')
      })
    await new Promise(res => setTimeout(res, 3500)) // wait 1s
    return client
  }

export async function loadQueryNode (fileBasePath: string, name: string): Promise<DocumentNode> {

    let queryPath = path.join(fileBasePath, `${name}.graphql`)
    // console.log(queryPath)
    
    return gql`${await fs.promises.readFile(queryPath)}`
}


export function saveResult(
  data: any,
  subdir: string = "orig",
  subject: string = "standard",
  filename: string = "result.json"
) {
  const resultsDir = path.resolve(__dirname, subdir, "results", subject);

  // make sure results folder exists
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  // write JSON file
  const filePath = path.join(resultsDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

  console.log(`✅ Result written to ${filePath}`);
}

export default { loadQueryNode, createTestApolloClient, saveResult }