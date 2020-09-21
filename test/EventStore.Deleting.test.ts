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
    describe('When deleting any stream', () => {
      describe('And the stream id is dodgy', () => {
        const invalidStreamIds = [null, undefined, '', ' ']
        invalidStreamIds.forEach((invalidStreamId) => {
          it(`It should throw an error for stream id: '${invalidStreamId}'`, async () => {
            const sut = await getStore()
            await expect(sut.deleteStream(invalidStreamId as string)).rejects.toThrow(
              'streamId can not be null, empty string or contain only whitespace'
            )
          })
        })
      })
    })
    describe('When deleting an empty stream', () => {
      it('It should successfully complete', async () => {
        const streamId = newGuid()
        const sut = await getStore()
        await expect(sut.deleteStream(streamId)).resolves.not.toThrow()
      })
    })
    describe('When deleting an existing stream', () => {
      it('It should delete all events from the stream all events', async () => {
        const streamId = newGuid()
        const sut = await getStore()
        const firstEvent = new EventData(newGuid(), new OrderCreated(streamId))
        const secondEvent = new EventData(newGuid(), new OrderDispatched(streamId))

        await sut.appendToStream(streamId, 0, firstEvent)
        await sut.appendToStream(streamId, 1, secondEvent)

        const stream = await sut.readStreamForwards(streamId)

        expect(stream).toHaveLength(2)
        await sut.deleteStream(streamId)
        const noEvents = await sut.readStreamForwards(streamId)
        expect(noEvents).toHaveLength(0)
      })
    })
  })
})
