import { IStorageEngine } from '../IStorageEngine'
import { EventStorage } from '../EventStorage'

class DynamoDbStorageEngine implements IStorageEngine {
  public appendToStream(streamId: string, events: EventStorage[]): Promise<void> {
    throw new Error('NOT IMPLEMENTED') // TODO: Implement this
  }

  public initialise(): Promise<IStorageEngine> {
    throw new Error('NOT IMPLEMENTED') // TODO: Implement this
  }

  public readStreamForwards(
    streamId: string,
    startPosition: number,
    numberOfEvents: number
  ): Promise<EventStorage[]> {
    throw new Error('NOT IMPLEMENTED') // TODO: Implement this
  }
}
export { DynamoDbStorageEngine }
