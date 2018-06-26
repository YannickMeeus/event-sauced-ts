import { EventData } from './EventData'

class StorageEvent {
  constructor(
    public readonly streamId: string,
    public readonly data: EventData,
    public readonly eventNumber: number
  ) {}
}

export { StorageEvent }
