# Event-Sauced - Slightly opinionated multi-database Event Store

> For when you need to store events... in a store... of some description

>## Both the README document and the library itself are a work-in-progress. Under no circumstances should you be using this library in production.

[![CircleCI](https://circleci.com/gh/YannickMeeus/event-sauced-ts.svg?style=shield)](https://circleci.com/gh/YannickMeeus/event-sauced-ts)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3e0163bac8dc40bdb5cd501e6689b8d0)](https://www.codacy.com/app/MillingCode/event-sauced?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=YannickMeeus/event-sauced&amp;utm_campaign=Badge_Grade)
[![Coverage Status](https://coveralls.io/repos/github/YannickMeeus/event-sauced-ts/badge.svg?branch=master)](https://coveralls.io/github/YannickMeeus/event-sauced-ts?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/yannickmeeus/event-sauced-ts.svg)](https://greenkeeper.io/)
[![Dev Dependencies](https://david-dm.org/YannickMeeus/event-sauced-ts/dev-status.svg)](https://david-dm.org/YannickMeeus/event-sauced-ts?type=dev)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)


This project started out as a re-implementation of [ASOS/SimpleEventStore](https://github.com/ASOS/SimpleEventStore) in TypeScript. What was initially just a simple re-write, is slowly becoming a more featured library.

The goal of Event-Sauced is to be provide a database-agnostic API for an event store. It will be slightly opinionated, but only to the point of provided the right abstraction over the various databases. It operates on a couple of premises:

- Be able to get going with only the core module and the included `InMemoryStorageEngine`
- Be as modular as possible - no reason to pull down the `aws-sdk` if you are going to use PostgreSQL as a data engine
- Allow users to implement - and inject - their own data engines if so desired
- Provide data consistency and concurrency support in all supported engines

## Usage

### JavaScript

```js
// TODO: fill this in

```

### TypeScript

```ts
import {EventStore} from 'event-sauced'
// TODO: fill this in
```

## Install

### Core library
With [npm](https://npmjs.org/) installed, run

```sh
$ npm install event-sauced
```

### Data Storage Engines

With [npm](https://npmjs.org/) installed, run

```sh
$ npm install event-sauced-dynamodb
$ npm install event-sauced-cosmosdb
$ npm install event-sauced-postgresql
...
```

## Acknowledgments

event-sauced was inspired by..

## See Also

- [`noffle/common-readme`](https://github.com/noffle/common-readme)
- ...

## License

MIT

