import { StorageEvent } from './StorageEvent'

interface IStorageEngine {
  appendToStream(streamId: string, events: StorageEvent[]): Promise<void>
  readStreamForwards(
    streamId: string,
    startPosition: number,
    numberOfEvents: number
  ): Promise<StorageEvent[]>
  initialise(): Promise<IStorageEngine>
}

export { IStorageEngine }
