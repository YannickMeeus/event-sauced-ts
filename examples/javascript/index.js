const e = require('../../dist/event-sauced-ts.umd');

const toEventData = (event) => new e.EventData(event.id, event)

const storageEngine = new e.InMemoryStorageEngine();
const eventStore = new e.EventStore(storageEngine);

(async function main() {
  const streamId = 'd864da7d-c879-452d-9570-fbd1ce377b86'

  const firstEvent = {
    id: 'ba6945f4-04a6-44a9-9d93-936e49cb07d3',
    type: 'UserCreated',
    firstName: 'Yannick',
    lastName: 'Meeus'
  };

  const secondEvent = {
    id: '3d5520a4-9977-4c1e-9052-52037165dfb6',
    type: 'AgeChanged',
    newAge: 33
  }

  const thirdEvent = {
    id: '7699c01f-25f9-4ab5-9f85-ac939693905e',
    type: 'JobChanged',
    newJob: 'Superhero'
  }

  const firstTwoEvents = [firstEvent, secondEvent].map(toEventData)

  // Add the first two events to the stream
  await eventStore.AppendToStream(streamId, 0, ...firstTwoEvents);

  // Retrieve the full stream
  let currentStoredEventStream = await eventStore.readStreamForwards(streamId)
  console.log(currentStoredEventStream);

  // Add the third event to the stream, notice that we have to specify where we think we are in the stream.
  //   This is our concurrency check, the engine will verify this but the reason we have to be in agreement
  //   with the server is to ensure we do not get a corrupt stream.
  //   In practice, this would be hidden away from the consumer in the repository or what-not, but I wanted
  //   to keep that kind of complexity out of this.
  await eventStore.AppendToStream(streamId, 2, toEventData(thirdEvent))

  // Lo and behold, we now have a third event in the stream
  currentStoredEventStream = await eventStore.readStreamForwards(streamId)
  console.log(currentStoredEventStream);
})();
