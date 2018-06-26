import { Guard } from './errors/Guard'

class StorageEvent {
  constructor(
    public readonly streamId: string,
    public readonly data: EventData,
    public readonly eventNumber: number
  ) {}
}

class EventData {
  constructor(
    public readonly eventId: string,
    public readonly body: any,
    public readonly metaData: any = undefined
  ) {
    Guard.againstNull('body', body)
  }
}

export { StorageEvent, EventData }
