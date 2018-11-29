const concurrently = require('nps-utils').concurrent.nps
module.exports = {
  scripts: {
    pre: {
      default: concurrently('pre.lint', 'pre.build'),
      lint: 'tslint -t codeFrame \'src/**/*.ts\' \'test/**/*.ts\' -p .',
      build: 'rimraf dist',
    },

    build: 'nps prebuild && tsc --module commonjs && rollup -c rollup.config.ts && typedoc --out docs --target es6 --theme minimal --mode file src',
    default: 'rollup -c rollup.config.ts -w',
    test: {
      default: 'jest',
      watch: 'jest --watch',
      prod: 'nps "lint npm run test -- --coverage --no-cache"'
    },
    deployDocs: 'ts-node tools/gh-pages-publish',
    reportCoverage: 'cat ./coverage/lcov.info | coveralls',
    semanticRelease: 'semantic-release',
    semanticReleasePrepare: 'ts-node tools/semantic-release-prepare'
  }
};
