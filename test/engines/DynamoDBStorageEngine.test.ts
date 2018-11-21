import { DynamoDbStorageEngine } from '../../src/engines/DynamoDbStorageEngine'
import AWS = require('aws-sdk')
const region = 'eu-central-1'
const endpoint = 'http://localhost:8000'
const tableName = 'streams'

AWS.config.update({ region })
const client = new AWS.DynamoDB({ endpoint })

describe('Given a set up dynamoDB Storage Engine', () => {
  const engine = new DynamoDbStorageEngine(region, endpoint)

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
beforeEach(async () => {
  try {
    await client.deleteTable({ TableName: tableName }).promise()
  } catch (e) {
    // no-op, table did not exist to begin with
  }
})
