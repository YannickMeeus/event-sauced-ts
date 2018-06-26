import * as uuid from 'uuid'
import { EventData } from '../src/EventData'
import { StorageEvent } from '../src/StorageEvent'

describe('When creating an instance of a StorageEvent', () => {
  const expected = {
    eventId: uuid.v4(),
    eventBody: 'BODY',
    eventMetaData: 'METADATA',
    streamId: 'STREAMID',
    eventNumber: 1
  }
  const event = new EventData(expected.eventId, expected.eventBody, expected.eventMetaData)
  const sut = new StorageEvent(expected.streamId, event, expected.eventNumber)

  it('It should map the stream id correctly', () => {
    expect(sut.streamId).toEqual(expected.streamId)
  })
  it('It should map the event body correctly', () => {
    expect(sut.eventBody).toEqual(expected.eventBody)
  })
  it('It should map the event meta data correctly', () => {
    expect(sut.metaData).toEqual(expected.eventMetaData)
  })
  it('It should map the event number correctly', () => {
    expect(sut.eventNumber).toEqual(expected.eventNumber)
  })
  it('It should map the event id correctly', () => {
    expect(sut.eventId).toEqual(expected.eventId)
  })
})
