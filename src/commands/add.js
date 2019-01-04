const addPlugin = require('../utils/add-plugin')

exports.options = (yargs) => {
  yargs
    .positional('name', {
      description: 'plugin name',
      type: 'string'
    })
    .option('config', {
      description: 'plugin configuration in JSON',
      type: 'string'
    })
    .option('append-to-root', {
      description: 'whether to append the plugin configuration into the app root configuration',
      type: 'boolean',
      default: false
    })
}

exports.handler = async (argv) => {
  const name = argv.name
  const cwd = process.cwd()

  return addPlugin(cwd, name, {
    config: argv.config,
    appendToRoot: argv.appendToRoot,
    skipInstall: argv.skipInstall
  })
}
