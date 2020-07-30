const concurrently = require('nps-utils').concurrent.nps
const series = require('nps-utils').series.nps
module.exports = {
  scripts: {
    prerequisites: {
      default: concurrently('prerequisites.lint', 'prerequisites.build'),
      lint: {
        default: "eslint 'src/**/*.ts' 'test/**/*.ts'",
        fix: "eslint 'src/**/*.*' 'test/**/*.*' --fix"
      },
      build: 'rimraf dist'
    },
    build: {
      default: series('build.transpile', 'build.package'),
      transpile: 'tsc --module commonjs',
      package: 'rollup -c rollup.config.ts'
    },
    documentation: {
      default: series('documentation.generate', 'documentation.deploy'),
      generate: 'typedoc --out docs --target es6 --theme minimal --mode file src',
      deploy: 'ts-node tools/gh-pages-publish'
    },
    publish: {
      default: 'semantic-release',
      dryrun: 'semantic-release --dry-run',
      prepare: 'ts-node tools/semantic-release-prepare.ts'
    },
    coverage: {
      default: series('coverage.generate', 'coverage.report'),
      generate: 'jest --coverage --no-cache',
      report: 'cat ./coverage/lcov.info | coveralls'
    },
    default: 'rollup -c rollup.config.ts -w',
    test: {
      default: 'jest',
      watch: 'jest --watch'
    },
    maintenance: {
      default: series('maintenance.update_dependencies'),
      update_dependencies: {
        default: 'ncu',
        interactive: 'ncu -i -u'
      }
    }
  }
}
