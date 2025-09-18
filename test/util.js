
import fs from 'fs'

import path from 'path'

import gql from 'graphql-tag'

import pRetry from 'p-retry'
// const  pRetry = require('p-retry').default;

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch'

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
  apiUri
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
  apiUri
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
      if ((result.data)?.cardanoDbMeta?.initialized === false) {
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
    await new Promise(res => setTimeout(res, 2500)) // wait 1s
    return client
  }

export async function loadQueryNode (fileBasePath, name) {

    let queryPath = path.join(fileBasePath, `${name}.graphql`)
    // console.log(queryPath)
    
    return gql`${await fs.promises.readFile(queryPath)}`
}


export function saveResult(
  data,
  subdir = "orig",
  subject = "standard",
  filename = "result.json"
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

function graphqlToBlockfrost(graphqlResponse) {
  if (!graphqlResponse.paymentAddresses || graphqlResponse.paymentAddresses.length === 0) {
    return null; // no data
  }

  const payment = graphqlResponse.paymentAddresses[0]; // take the first address
  const address = payment.address;

  let amount = payment.summary.assetBalances.map(({ asset, quantity }) => {
    if (!asset.assetId) {
      // Native ADA (tADA -> lovelace)
      return {
        unit: "lovelace",
        quantity
      };
    }

    // Native asset: use assetId directly
    return {
      unit: asset.assetId,
      quantity
    };
  });

  // Sort: lovelace first, then rest alphabetically
  amount.sort((a, b) => {
    if (a.unit === "lovelace") return -1;
    if (b.unit === "lovelace") return 1;
    return a.unit.localeCompare(b.unit);
  });

  return { address, amount };
}

export default { loadQueryNode, createTestApolloClient, saveResult, graphqlToBlockfrost }