# Event-Sauced - Slightly opinionated multi-database Event Store

> For when you need to store events... in a store... of some description

![npm (scoped)](https://img.shields.io/npm/v/@make-stuff-work/event-sauced.svg)
[![Coverage Status](https://coveralls.io/repos/github/YannickMeeus/event-sauced-ts/badge.svg?branch=master)](https://coveralls.io/github/YannickMeeus/event-sauced-ts?branch=master)
[![Dev Dependencies](https://david-dm.org/YannickMeeus/event-sauced-ts/dev-status.svg)](https://david-dm.org/YannickMeeus/event-sauced-ts?type=dev)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This project started out as a re-implementation of [ASOS/SimpleEventStore](https://github.com/ASOS/SimpleEventStore) in TypeScript. What was initially just a simple re-write, is slowly becoming a more featured library.

The goal of Event-Sauced is to be provide a database-agnostic API for an event store. It will be slightly opinionated, but only to the point of provided the right abstraction over the various databases. It operates on a couple of premises:

- Be able to get going with only the core module and the included `InMemoryStorageEngine`
- Be as modular as possible - no reason to pull down the `aws-sdk` if you are going to use PostgreSQL as a data engine
- Allow users to implement - and inject - their own data engines if so desired
- Provide data consistency and concurrency support in all supported engines

## Documentation

The documentation is currently hosted on GitHub pages, and can be found [here](https://yannickmeeus.github.io/event-sauced-ts/).
It might not look the prettiest, but I can guarantee it's at least a little bit accurate.

## Install

With [npm](https://npmjs.org/) installed, run

```sh
npm install @make-stuff-work/event-sauced
```

## Usage

```js
// const eventStore = require('event-sauced-ts.umd);
// or
// const {...} = require(event-sauced-ts.umd)

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
  // This is our concurrency check, the engine will verify this but the reason we have to be in agreement
  // with the server is to ensure we do not get a corrupt stream.
  // In practice, this would be hidden away from the consumer in the repository or what-not, but I wanted
  // to keep that kind of complexity out of this.
  await eventStore.AppendToStream(streamId, 2, toEventData(thirdEvent))

  // Lo and behold, we now have a third event in the stream
  currentStoredEventStream = await eventStore.readStreamForwards(streamId)
  console.log(currentStoredEventStream);
})();

```


## License

MIT
