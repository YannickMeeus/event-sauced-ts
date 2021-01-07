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
      clean: "rimraf docs",
      // https://medium.com/google-developers/improving-actions-on-google-reference-documentation-with-the-new-typedoc-neo-theme-7a9d58b52c4a
      default: 'typedoc --out docs src/index.ts',
    },
    publish: {
      default: 'semantic-release',
      dryrun: 'semantic-release --dry-run',
      prepare: 'ts-node tools/semantic-release-prepare.ts'
    },
    default: 'rollup -c rollup.config.ts -w',
    test: {
      default: 'jest',
      includeCoverage: 'jest --coverage',
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
