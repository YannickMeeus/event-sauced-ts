import { InMemoryStorageEngine } from '../src/inMemory/InMemoryStorageEngine'
import { IStorageEngine } from '../src/IStorageEngine'
import * as uuid from 'uuid'
import { EventStore } from '../src/EventStore'
import { EventData } from '../src/EventData'
import { OrderCreated } from './Events/OrderCreated'
import { OrderDispatched } from './Events/OrderDispatched'

describe('Given a set of engines to test against', () => {
  const engineFactories: (() => IStorageEngine)[] = [() => new InMemoryStorageEngine()]
  const newGuid = () => uuid.v4()
  engineFactories.forEach((getEngine) => {
    const engine = getEngine()

    const getStore = async () => {
      await engine.initialise()
      return new EventStore(engine)
    }
    describe('When reading any stream', () => {
      describe('And the stream id is dodgy', () => {
        const invalidStreamIds = [null, undefined, '', ' ']
        invalidStreamIds.forEach((invalidStreamId) => {
          it(`It should throw an error for stream id: '${invalidStreamId}'`, async () => {
            const sut = await getStore()
            try {
              await sut.readStreamForwards(invalidStreamId as string)
            } catch (e) {
              expect(e.message).toEqual(
                'streamId can not be null, empty string or contain only whitespace'
              )
            }
          })
        })
      })
    })
    describe('When reading an empty stream', () => {
      it('It should return an empty array', async () => {
        const streamId = newGuid()
        const sut = await getStore()
        const events = await sut.readStreamForwards(streamId)

        expect(events.length).toEqual(0)
      })
    })
    describe('When reading a stream with multiple events', () => {
      it('It should return all events', async () => {
        const streamId = newGuid()
        const sut = await getStore()
        const firstEvent = new EventData(newGuid(), new OrderCreated(streamId))
        const secondEvent = new EventData(newGuid(), new OrderDispatched(streamId))

        await sut.appendToStream(streamId, 0, firstEvent)
        await sut.appendToStream(streamId, 1, secondEvent)

        const stream = await sut.readStreamForwards(streamId)

        expect(stream.length).toEqual(2)
        expect(stream.shift()?.eventBody).toBeInstanceOf(OrderCreated)
        expect(stream.shift()?.eventBody).toBeInstanceOf(OrderDispatched)
      })
      it('It should return a subset of events', async () => {
        const streamId = newGuid()
        const sut = await getStore()
        const firstEvent = new EventData(newGuid(), new OrderCreated(streamId))
        const secondEvent = new EventData(newGuid(), new OrderDispatched(streamId))

        await sut.appendToStream(streamId, 0, firstEvent)
        await sut.appendToStream(streamId, 1, secondEvent)

        const subsetOfStream = await sut.readStreamForwards(streamId, 2, 1)

        expect(subsetOfStream.length).toEqual(1)
        expect(subsetOfStream[0].eventBody).toBeInstanceOf(OrderDispatched)
      })
    })
  })
})
