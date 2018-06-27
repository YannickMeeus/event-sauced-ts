import { Guard } from './errors/Guard'
import { IStorageEngine } from './IStorageEngine'
import { EventData } from './EventData'
import { EventStorage } from './EventStorage'

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
    const storageEvents: EventStorage[] = []
    for (let i = 0; i < events.length; i++) {
      storageEvents.push(new EventStorage(streamId, events[i], ++eventVersion))
    }

    return this.engine.appendToStream(streamId, storageEvents)
  }

  public readStreamForwards(
    streamId: string,
    startPosition: number = 0,
    numberOfEvents: number = Number.MAX_SAFE_INTEGER
  ): Promise<EventStorage[]> {
    Guard.againstNullOrEmpty('streamId', streamId)
    return this.engine.readStreamForwards(streamId, startPosition, numberOfEvents)
  }
}

export { EventStore }
