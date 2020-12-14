const Table = require('easy-table')
const _ = require('lodash')
const listPlugins = require('../../utils/list-plugins')

function builder (yargs) {
  yargs
    .positional('type', {
      description: 'plugin type filter',
      type: 'string',
      choices: ['output', 'provider', 'cache', 'auth']
    })
}

async function handler (argv) {
  const type = argv.type
  const cwd = process.cwd()
  const plugins = await listPlugins(cwd, type, argv)
  const logger = argv.logger

  if (plugins.length === 0) {
    logger.info('No plugin is found.')
  } else {
    logger.info(`${plugins.length} plugins are found.\n`)

    const table = new Table()

    _
      .sortBy(plugins, 'type')
      .forEach((plugin, index) => {
        table.cell('#', index + 1)
        table.cell('Name', plugin.name)
        table.cell('Type', plugin.type)
        table.cell('Is local plugin?', plugin.local)
        table.newRow()
      })

    console.log(table.toString())
  }
}

module.exports = {
  command: 'list [type]',
  description: 'list plugins added to the current app',
  builder,
  handler
}
