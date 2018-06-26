import { EventData } from '../src/EventData'
import * as uuid from 'uuid'

describe('When the body is not provided', () => {
  it('It should throw an error', () => {
    expect(() => new EventData(uuid.v4(), undefined)).toThrowError('body can not be null')
  })
})
describe('When creating an instance of a StorageEvent', () => {
  const eventId = uuid.v4()

  const expectedMetaData = 'METADATA'
  const expectedBody = 'BODY'
  const eventData = new EventData(eventId, expectedBody, expectedMetaData)
  it('It should map the event Id correctly', () => {
    expect(eventData.eventId).toEqual(eventId)
  })
  it('It should map the body correctly', () => {
    expect(eventData.body).toEqual(expectedBody)
  })
  it('It should map the meta data correctly', () => {
    expect(eventData.metaData).toEqual(expectedMetaData)
  })
})
