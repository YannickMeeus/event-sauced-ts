import { EventData } from './EventData'

// TODO: Rename as clashes with native type
class StorageEvent {
  public eventBody: any
  public metaData: any
  public eventId: string

  constructor(
    public readonly streamId: string,
    eventData: EventData,
    public readonly eventNumber: number
  ) {
    this.eventBody = eventData.body
    this.metaData = eventData.metaData
    this.eventId = eventData.eventId
  }
}

export { StorageEvent }
