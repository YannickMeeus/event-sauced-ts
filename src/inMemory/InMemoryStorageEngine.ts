import { IStorageEngine } from '../IStorageEngine'
import { StorageEvent } from '../StorageEvent'

class InMemoryStorageEngine implements IStorageEngine {
  private readonly streams: Map<string, StorageEvent[]>

  constructor() {
    this.streams = new Map<string, StorageEvent[]>()
  }

  public async appendToStream(streamId: string, events: StorageEvent[]): Promise<void> {
    if (!this.streams.has(streamId)) {
      this.streams.set(streamId, [])
    }

    const firstEvent = events[0]
    if (firstEvent.eventNumber - 1 !== this.streams.get(streamId)!.length) {
      throw new ConcurrencyError(
        `Concurrency conflict when appending to stream ${streamId}. Expected revision ${
          firstEvent.eventNumber
        } : Actual revision ${this.streams.get(streamId)!.length}"`
      )
    }

    this.streams.set(streamId, events)
  }

  public async readStreamForwards(
    streamId: string,
    startPosition: number,
    numberOfEvents: number
  ): Promise<StorageEvent[]> {
    if (!this.streams.has(streamId)) {
      return []
    }

    return this.streams.get(streamId)!.slice(startPosition, startPosition + numberOfEvents)
  }

  public async initialise(): Promise<IStorageEngine> {
    return this
  }
}

export { InMemoryStorageEngine }
