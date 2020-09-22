import { EventStorage } from './EventStorage'

interface IStorageEngine {
  /**
   * Some storage engines require initialization. This can include:
   *  - Creating a new table/document collection to hold the streams
   *  - Adding constraints to aid in concurrency checks
   *  - Adding indexes to facilitate efficient querying
   *  - Adding unique key constrains to ensure data integrity
   *  - Setting throughput requirements accordingly
   *  - Waiting for initialization is complete and the collection is writeable prior
   *    returning
   * @returns {Promise<IStorageEngine>} The initialised storage engine is returned,
   * so that subsequent calls can be made directly against it. Usually this is not
   * a requirement but your mileage may vary.
   * @memberof IStorageEngine
   */
  initialise(): Promise<IStorageEngine>
  /**
   * Append a number of events to a stream. Storage engine specific
   * concurrency checks will apply, to ensure streams maintain their
   * integrity.
   *
   * @param {string} streamId This is the core identifier for a single stream.
   * It can be the natural unique key for an event type, such as a 'user id'.
   *
   * It can not be empty, null, undefined or any other crazy business.
   * @param {EventStorage[]} events The list of events to append to a stream. Currently there
   * is no guard in place for passing in an empty array or nothing, so keep that in mind.
   *
   * @returns {Promise<void>}
   * @memberof IStorageEngine
   */
  appendToStream(streamId: string, events: EventStorage[]): Promise<void>
  /**
   * Returns a list of events contained in a stream. It supports either
   * returning the entire stream, a subset of the stream from a starting position onwards
   * and a slice of the stream based on the starting position and the number of events.
   *
   * If the stream is empty, an empty is array is returned. Currently no validation is applied
   * in any of the engines to verify the sensibility of your startPosition and numberOfEvents
   * parameters. If they make no sense, the results will make no sense.
   *
   * @param {string} streamId This is the core identifier for a single stream.
   * It can be the natural unique key for an event type, such as a 'user id'.
   * @param {number} startPosition The position of the event you want to start reading
   * the stream for. TODO: Specify whether this is 0-based or 1-based.
   * @param {number} numberOfEvents The amount of events to pull out of the stream.
   * @returns {Promise<EventStorage[]>}
   * @memberof IStorageEngine
   */
  readStreamForwards(
    streamId: string,
    startPosition: number,
    numberOfEvents: number
  ): Promise<EventStorage[]>

  /**
   * Completely deletes an entire stream. This is a destructive operation, so please ensure
   * this is what you want to achieve.
   *
   * If the stream is non-existent, the operation should be idem-potent and return
   * a success. It should only throw in case deletion is impossible due to downstream failures.
   *
   * It can be the natural unique key for an event type, such as a 'user id'.
   * @returns {Promise<void>}
   * @memberof IStorageEngine
   * @param streamId This is the core identifier for a single stream.
   * It can be the natural unique key for an event type, such as a 'user id'.
   */
  deleteStream(streamId: string): Promise<void>

  /**
   * Much like being initialized, the event store needs to be terminated gracefully
   * in the case of an expected shutdown, or during testing.
   *
   * There is no guarantee as to whether a particular engine requires this call,
   * so I'll leave that up to the consumer to figure out from the engine-specific
   * documentation. If in doubt, terminate.
   *
   * @returns {Promise<void>}
   * @memberof IStorageEngine
   */
  terminate(): Promise<void>
}

export { IStorageEngine }
