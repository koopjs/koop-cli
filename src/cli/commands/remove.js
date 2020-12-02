const removePlugin = require('../../utils/remove-plugin')

function builder (yargs) {
  yargs
    .positional('name', {
      description: 'plugin name',
      type: 'string'
    })
    .option('skip-install', {
      description: 'skip plugin installation',
      type: 'boolean',
      default: false
    })
}

async function handler (argv) {
  const name = argv.name
  const cwd = process.cwd()

  return removePlugin(cwd, name, argv)
}

module.exports = {
  command: 'remove <name>',
  description: 'remove an existing plugin from the current app',
  builder,
  handler
}
