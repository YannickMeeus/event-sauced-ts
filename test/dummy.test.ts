import credentials = require('../.credentials/dynamo-db-test-credentials.json')
import { DynamoDbStorageEngine } from '../src/engines/DynamoDbStorageEngine'
import * as uuid from 'uuid'
import { EventData } from '../src/EventData'
import { OrderCreated } from './Events/OrderCreated'
import { EventStore } from '../src/EventStore'
const region = 'eu-central-1'
const engine = new DynamoDbStorageEngine(region, credentials)
const store = new EventStore(engine)
const newGuid = () => uuid.v4()
describe('Dummy test', () => {
  it('It should do some stuff', async () => {
    interface SomeMetaData {
      value: string
    }

    const metaData: SomeMetaData = {
      value: 'foo'
    }
    const streamId = 'foo'
    // await engine.initialise()
    const eventToPersist = new EventData(newGuid(), new OrderCreated(streamId), metaData)
    await store.AppendToStream(streamId, 0, eventToPersist)

    // const events = await store.readStreamForwards(streamId)
    // console.log(events)
  })
})
