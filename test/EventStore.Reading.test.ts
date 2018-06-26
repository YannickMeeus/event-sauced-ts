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
  engineFactories.forEach(getEngine => {
    const engine = getEngine()

    const getStore = async () => {
      await engine.initialise()
      return new EventStore(engine)
    }
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

        await sut.AppendToStream(streamId, 0, firstEvent)
        await sut.AppendToStream(streamId, 1, secondEvent)

        const stream = await sut.readStreamForwards(streamId)

        expect(stream.length).toEqual(2)
        expect(stream.shift()!.eventBody).toBeInstanceOf(OrderCreated)
        expect(stream.shift()!.eventBody).toBeInstanceOf(OrderDispatched)
      })
    })
  })
})
