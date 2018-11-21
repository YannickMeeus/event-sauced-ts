import { DynamoDbStorageEngine } from '../../src/engines/DynamoDbStorageEngine'
import AWS = require('aws-sdk')
import credentials = require('../../.credentials/dynamo-db-test-credentials.json')
const region = 'eu-central-1'
const tableName = 'streams'
AWS.config.update({ region })

const client = new AWS.DynamoDB({
  credentials: {
    accessKeyId: credentials.key,
    secretAccessKey: credentials.secret
  }
})

describe('Given a set up dynamoDB Storage Engine', () => {
  const engine = new DynamoDbStorageEngine(region, credentials)

  describe('When the storage engine is initialized', () => {
    it(`It should create a table called 'streams'`, async () => {
      await engine.initialise()
      const createdTable = await client.describeTable({ TableName: tableName }).promise()
      expect(createdTable).not.toBeUndefined()
    })
    it('It should not try and recreate the existing table again if a second round of initialization happens', async () => {
      await engine.initialise()
      await expect(engine.initialise()).resolves
    })
  })
})

afterEach(async () => {
  try {
    await client.deleteTable({ TableName: tableName }).promise()
  } catch (e) {
    // no-op, table did not exist to begin with
  }
})
