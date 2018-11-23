# Simple Event Store Typescript

[![CircleCI](https://circleci.com/gh/YannickMeeus/event-sauced-ts.svg?style=shield)](https://circleci.com/gh/YannickMeeus/event-sauced-ts)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3e0163bac8dc40bdb5cd501e6689b8d0)](https://www.codacy.com/app/MillingCode/event-sauced?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=YannickMeeus/event-sauced&amp;utm_campaign=Badge_Grade)
[![Coverage Status](https://coveralls.io/repos/github/YannickMeeus/event-sauced-ts/badge.svg?branch=master)](https://coveralls.io/github/YannickMeeus/event-sauced-ts?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/yannickmeeus/event-sauced.svg)](https://greenkeeper.io/)
[![Dev Dependencies](https://david-dm.org/YannickMeeus/event-sauced-ts/dev-status.svg)](https://david-dm.org/YannickMeeus/event-sauced-ts?type=dev)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## NPM scripts

- `npm t`: Run test suite
- `npm start`: Run `npm run build` in watch mode
- `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
- `npm run test:prod`: Run linting and generate coverage
- `npm run build`: Generate bundles and typings, create docs
- `npm run lint`: Lints code
- `npm run commit`: Commit using conventional commit style ([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:)

## Excluding peerDependencies

On library development, one might want to set some peer dependencies, and thus remove those from the final bundle. You can see in [Rollup docs](https://rollupjs.org/#peer-dependencies) how to do that.

Good news: the setup is here for you, you must only include the dependency name in `external` property within `rollup.config.js`. For example, if you want to exclude `lodash`, just write there `external: ['lodash']`.

```bash
npm install --global --production windows-build-tools
```

## Setup steps

Follow the console instructions to install semantic release and run it (answer NO to "Do you want a `.travis.yml` file with semantic-release setup?").

_Note: make sure you've setup `repository.url` in your `package.json` file_

```bash
npm install -g semantic-release-cli
semantic-release-cli setup
# IMPORTANT!! Answer NO to "Do you want a `.travis.yml` file with semantic-release setup?" question. It is already prepared for you :P
```

From now on, you'll need to use `npm run commit`, which is a convenient way to create conventional commits.

Automatic releases are possible thanks to [semantic release](https://github.com/semantic-release/semantic-release), which publishes your code automatically on [github](https://github.com/) and [npm](https://www.npmjs.com/), plus generates automatically a changelog. This setup is highly influenced by [Kent C. Dodds course on egghead.io](https://egghead.io/courses/how-to-write-an-open-source-javascript-library)

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind are welcome!
