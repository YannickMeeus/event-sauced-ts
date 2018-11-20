import { IStorageEngine } from '../IStorageEngine'
import { EventStorage } from '../EventStorage'

class DynamoDBStorageEngine implements IStorageEngine {
  appendToStream(streamId: string, events: EventStorage[]): Promise<void> {
    throw new Error('Method not implemented.')
  }

  readStreamForwards(
    streamId: string,
    startPosition: number,
    numberOfEvents: number
  ): Promise<EventStorage[]> {
    throw new Error('Method not implemented.')
  }
  initialise(): Promise<IStorageEngine> {
    throw new Error('Method not implemented.')
  }
}
