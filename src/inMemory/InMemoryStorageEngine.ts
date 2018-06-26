import { IStorageEngine } from '../IStorageEngine'
import { StorageEvent } from '../StorageEvent'
import { ConcurrencyError } from '../errors/ConcurrencyError'

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
    const stream = this.streams.get(streamId)!.concat(events)
    this.streams.set(streamId, stream)
  }

  public async readStreamForwards(
    streamId: string,
    startPosition: number,
    numberOfEvents: number
  ): Promise<StorageEvent[]> {
    if (!this.streams.has(streamId)) {
      return []
    }
    const index = startPosition <= 0 ? 0 : startPosition - 1
    return this.streams.get(streamId)!.slice(index, startPosition + numberOfEvents)
  }

  public async initialise(): Promise<IStorageEngine> {
    return this
  }
}

export { InMemoryStorageEngine }
