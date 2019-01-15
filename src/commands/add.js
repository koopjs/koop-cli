const addPlugin = require('../utils/add-plugin')

exports.options = (yargs) => {
  yargs
    .positional('name', {
      description: 'plugin name',
      type: 'string'
    })
    .option('config', {
      description: 'specify the plugin configuration in JSON',
      type: 'string'
    })
    .option('add-to-root', {
      description: 'add the given configuration to the app root configuration',
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
