import { InMemoryStorageEngine } from '../src/inMemory/InMemoryStorageEngine'
import { EventStore } from '../src/EventStore'
import { IStorageEngine } from '../src/IStorageEngine'
import * as uuid from 'uuid'
import { EventData } from '../src/EventData'
import { OrderCreated } from './Events/OrderCreated'

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
  })
})
