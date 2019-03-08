import { Guard } from './errors/Guard'
import { IStorageEngine } from './IStorageEngine'
import { EventData } from './EventData'
import { EventStorage } from './EventStorage'

class EventStore {
  constructor(private readonly engine: IStorageEngine) {
    Guard.againstNull('engine', engine)
  }

  /**
   * Append a number of events to a stream. Storage engine specific
   * concurrency checks will apply, to ensure streams maintain their
   * integrity.
   *
   * @param {string} streamId This is the core identifier for a single stream.
   * It can be the natural unique key for an event type, such as a 'user id'.
   *
   * It can not be empty, null, undefined or any other crazy business.
   * @param {number} expectedVersion This is the version that the client side (your code)
   * thinks the stream is currently operating against. If it was version 2 when you read
   * the stream, you should pass in 2.
   * @param {EventData[]} events The list of events to append to a stream. Currently there
   * is no guard in place for passing in an empty array, so keep that in mind.
   *
   * @returns {Promise<void>}
   * @memberof EventStore
   */
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
    // TODO: Change this to return eventData,
    //       instead of EventStorage as I think this is a leaky abstraction.
    //       This does mean that the return would have to be a tuple in order to
    //       know what the version of the stream actually is. Maybe return a Stream
    //       object instead.
    Guard.againstNullOrEmpty('streamId', streamId)
    return this.engine.readStreamForwards(streamId, startPosition, numberOfEvents)
  }
}

export { EventStore }
