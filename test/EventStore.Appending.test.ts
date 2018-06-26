import { InMemoryStorageEngine } from '../src/inMemory/InMemoryStorageEngine'
import { EventStore } from '../src/EventStore'
import { IStorageEngine } from '../src/IStorageEngine'
import { StorageEvent } from '../src/StorageEvent'
import * as uuid from 'uuid'
import { EventData } from '../src/EventData'
import { OrderCreated } from './Events/OrderCreated'
import { OrderDispatched } from './Events/OrderDispatched'

describe('Given a set of engines to test against', () => {
  const engineFactories: (() => IStorageEngine)[] = [() => new InMemoryStorageEngine()]

  const newGuid = () => uuid.v4()
  engineFactories.forEach(getEngine => {
    const getStore = async () => {
      await getEngine().initialise()
      return new EventStore(engine)
    }
    const engine = getEngine()
    describe('When appending to a new stream', () => {
      describe('And the stream id is invalid', () => {
        const invalidStreamIds = [undefined, null, '', ' ']
        invalidStreamIds.forEach(invalidStreamId => {
          it(`It should throw an error for stream id: '${invalidStreamId}'`, async () => {
            const eventStore = await getStore()
            const event = new EventData(newGuid(), 'BODY')
            try {
              await eventStore.AppendToStream(invalidStreamId as string, 0, event)
            } catch (e) {
              expect(e.message).toEqual(
                'streamId can not be null, empty string or contain only whitespace'
              )
            }
          })
        })
      })
      describe('And we have multiple events to save', () => {
        const streamId = newGuid()
        const firstEvent = new EventData(newGuid(), new OrderCreated(streamId))
        const secondEvent = new EventData(newGuid(), new OrderDispatched(streamId))
        const eventsToSave = [firstEvent, secondEvent]

        it('It should save both events and allow them to be retrievable', async () => {
          const sut = await getStore()
          await sut.AppendToStream(streamId, 0, ...eventsToSave)

          const savedEvents = await sut.readStreamForwards(streamId)

          expect(savedEvents.length).toEqual(2)
          const firstSavedEvent = savedEvents.shift() as StorageEvent
          const secondSavedEvent = savedEvents.shift() as StorageEvent

          expect(firstSavedEvent.streamId).toEqual(streamId)
          expect(firstSavedEvent.eventNumber).toEqual(1)

          expect(secondSavedEvent.streamId).toEqual(streamId)
          expect(secondSavedEvent.eventNumber).toEqual(2)
        })
      })
      it('It should save the event', async () => {
        const streamId = newGuid()
        const sut = await getStore()
        const event = new EventData(newGuid(), new OrderCreated(streamId))

        await sut.AppendToStream(streamId, 0, event)

        const stream = await sut.readStreamForwards(streamId)
        expect(stream.length).toEqual(1)
        const savedEvent = stream[0]
        expect(savedEvent.streamId).toEqual(streamId)
        expect(savedEvent.eventId).toEqual(event.eventId)
        expect(savedEvent.eventNumber).toEqual(1)
      })
    })
    describe('When appending to an existing stream', () => {
      it('It should save the event', async () => {
        const streamId = newGuid()
        const sut = await getStore()
        const firstEvent = new EventData(newGuid(), new OrderCreated(streamId))
        const secondEvent = new EventData(newGuid(), new OrderDispatched(streamId))
        await sut.AppendToStream(streamId, 0, firstEvent)

        await sut.AppendToStream(streamId, 1, secondEvent)

        const stream = await sut.readStreamForwards(streamId)

        expect(stream.length).toEqual(2)
        const lastEvent = stream.pop() as StorageEvent
        expect(lastEvent.eventId).toEqual(secondEvent.eventId)
        expect(lastEvent.eventNumber).toEqual(2)
      })
    })
    describe('When appending to a new stream with an unexpected version', () => {
      const invalidRevisions = [-1, 1, 2, 99]
      invalidRevisions.forEach(invalidRevision => {
        it(`It should throw a concurrency error with revision number: '${invalidRevision}'`, async () => {
          const streamId = newGuid()
          const sut = await getStore()
          const event = new EventData(newGuid(), new OrderDispatched(streamId))

          await expect(sut.AppendToStream(streamId, invalidRevision, event)).rejects.toThrow(
            'Concurrency conflict'
          )
        })
      })
    })
    describe('When appending to an existing stream with an unexpected version', () => {
      const invalidRevisions = [0, 2]
      invalidRevisions.forEach(invalidRevision => {
        it(`It should throw a concurrency error with revision number: '${invalidRevision}'`, async () => {
          const streamId = newGuid()
          const sut = await getStore()

          const existingEvent = new EventData(newGuid(), new OrderCreated(streamId))
          const newEvent = new EventData(newGuid(), new OrderDispatched(streamId))
          await sut.AppendToStream(streamId, 0, existingEvent)
          await expect(sut.AppendToStream(streamId, invalidRevision, newEvent)).rejects.toThrow(
            'Concurrency conflict'
          )
        })
      })
    })
  })
})
