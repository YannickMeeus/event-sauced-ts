import { InMemoryStorageEngine } from '../src/inMemory/InMemoryStorageEngine'
import { IStorageEngine } from '../src/IStorageEngine'
import * as uuid from 'uuid'
import { EventStore } from '../src/EventStore'

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
  })
})
