import { IStorageEngine } from '../IStorageEngine'
import { EventStorage } from '../EventStorage'

import AWS = require('aws-sdk')

interface DynamoDBCredentials {
  key: string
  secret: string
}

class DynamoDbStorageEngine implements IStorageEngine {
  private readonly client: AWS.DynamoDB
  private readonly tableName: string = 'streams'

  constructor(region: string, credentials?: DynamoDBCredentials) {
    AWS.config.update({ region })
    if (credentials) {
      AWS.config.update({
        credentials: {
          accessKeyId: credentials.key,
          secretAccessKey: credentials.secret
        }
      })
    }
    this.client = new AWS.DynamoDB()
  }
  public appendToStream(streamId: string, events: EventStorage[]): Promise<void> {
    throw new Error('NOT IMPLEMENTED') // TODO: Implement this
  }

  public async initialise(): Promise<IStorageEngine> {
    const existingTables = await this.client.listTables().promise()

    if (existingTables.TableNames.indexOf(this.tableName) >= 0) {
      return this
    }
    const creationParameters = {
      TableName: this.tableName,
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      },
      KeySchema: [{ AttributeName: 'StreamId', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'StreamId', AttributeType: 'S' }]
    }
    await this.client.createTable(creationParameters).promise()
    return this
  }

  public readStreamForwards(
    streamId: string,
    startPosition: number,
    numberOfEvents: number
  ): Promise<EventStorage[]> {
    throw new Error('NOT IMPLEMENTED') // TODO: Implement this
  }
}
export { DynamoDbStorageEngine, DynamoDBCredentials }
