import { Guard } from './errors/Guard'

class EventData {
  constructor(
    public readonly eventId: string,
    public readonly body: any,
    public readonly metaData: any = undefined
  ) {
    Guard.againstNull('body', body)
  }
}

export { EventData }
