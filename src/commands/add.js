const addPlugin = require('../utils/add-plugin')

function builder (yargs) {
  yargs
    .positional('type', {
      description: 'plugin type',
      type: 'string',
      choices: ['output', 'provider', 'cache', 'auth']
    })
    .positional('name', {
      description: 'plugin name',
      type: 'string'
    })
    .option('route-prefix', {
      description: 'add a prefix to all of a registered provider’s routes',
      type: 'string',
      group: 'Provider Options:'
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
    .option('skip-install', {
      description: 'skip plugin installation',
      type: 'boolean',
      default: false
    })
    .option('local', {
      description: 'add a plugin from a local path',
      type: 'boolean'
    })
}

async function handler (argv) {
  const name = argv.name
  const type = argv.type
  const cwd = process.cwd()

  return addPlugin(cwd, type, name, argv)
}

module.exports = {
  command: 'add <type> <name>',
  description: 'add a new plugin to the current app',
  builder,
  handler
}
