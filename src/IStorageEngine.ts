import { EventStorage } from './EventStorage'

interface IStorageEngine {
  appendToStream(streamId: string, events: EventStorage[]): Promise<void>
  readStreamForwards(
    streamId: string,
    startPosition: number,
    numberOfEvents: number
  ): Promise<EventStorage[]>
  initialise(): Promise<IStorageEngine>
}

export { IStorageEngine }
