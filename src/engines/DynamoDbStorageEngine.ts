import { IStorageEngine } from '../IStorageEngine'
import { EventStorage } from '../EventStorage'

import AWS = require('aws-sdk')
import { DynamoDB } from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

interface DynamoDBCredentials {
  key: string
  secret: string
}

class DynamoDbStorageEngine implements IStorageEngine {
  private readonly client: AWS.DynamoDB
  private readonly tableName: string = 'streams'
  private documentClient: DocumentClient

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
    this.documentClient = new AWS.DynamoDB.DocumentClient()
  }
  public async initialise(): Promise<IStorageEngine> {
    const existingTables = await this.client.listTables().promise()

    if (existingTables.TableNames.indexOf(this.tableName) >= 0) {
      return this
    }
    const creationParameters: DynamoDB.Types.CreateTableInput = {
      TableName: this.tableName,
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      },
      KeySchema: [{ AttributeName: 'Id', KeyType: 'HASH' }],
      AttributeDefinitions: [
        { AttributeName: 'Id', AttributeType: 'S' },
        { AttributeName: 'StreamId', AttributeType: 'S' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'IX_StreamId',
          KeySchema: [{ AttributeName: 'StreamId', KeyType: 'HASH' }],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: {
            WriteCapacityUnits: 5,
            ReadCapacityUnits: 5
          }
        }
      ]
    }
    // TODO: Ensure the table is created before we return
    // HINT: dynamodb.waitfor table exists
    await this.client.createTable(creationParameters).promise()
    return this
  }

  public async appendToStream(streamId: string, events: EventStorage[]): Promise<void> {
    const toItem = event => {
      return {
        Id: `${event.streamId}:${event.eventNumber}`,
        EventId: event.eventId,
        Body: JSON.stringify(event.eventBody),
        EventType: event.eventBody.constructor.name,
        Metadata: event.metaData,
        StreamId: event.streamId,
        EventNumber: event.eventNumber
      }
    }

    const putEvent = async event => {
      await this.documentClient
        .put({
          TableName: this.tableName,
          Item: toItem(event),
          // The condition expression is part of the concurrency checks.
          //   If an item with this Id (which is generated based on stream id
          //   and assumed event number) already exists, this request
          //   will fail with a deterministic error.
          ConditionExpression: 'attribute_not_exists(Id)'
        })
        .promise()
    }

    for (const event of events) {
      await putEvent(event)
    }
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
