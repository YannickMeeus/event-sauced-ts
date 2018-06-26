import { Guard } from './errors/Guard'
import { StorageEvent } from './StorageEvent'
import { IStorageEngine } from './IStorageEngine'
import { EventData } from './EventData'

class EventStore {
  constructor(private readonly engine: IStorageEngine) {
    Guard.againstNull('engine', engine)
  }

  public AppendToStream(
    streamId: string,
    expectedVersion: number,
    ...events: EventData[]
  ): Promise<void> {
    Guard.againstNullOrEmpty('streamId', streamId)
    let eventVersion = expectedVersion
    const storageEvents: StorageEvent[] = []
    for (let i = 0; i < events.length; i++) {
      storageEvents.push(new StorageEvent(streamId, events[i], ++eventVersion))
    }

    return this.engine.appendToStream(streamId, storageEvents)
  }

  public readStreamForwards(
    streamId: string,
    startPosition: number = 0,
    numberOfEvents: number = Number.MAX_SAFE_INTEGER
  ): Promise<StorageEvent[]> {
    Guard.againstNullOrEmpty('streamId', streamId)
    return this.engine.readStreamForwards(streamId, startPosition, numberOfEvents)
  }
}
