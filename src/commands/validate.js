const Table = require('easy-table')
const _ = require('lodash')
const validatePlugin = require('../utils/validate-plugin')

async function handler (argv) {
  const cwd = process.cwd()
  const result = await validatePlugin(cwd, argv)

  if (result.valid) {
    // TODO use a new logger
    console.log('The plugin is valid.')
  } else {
    // TODO use a new logger
    console.log('The plugin is not valid.\n')

    const table = new Table()

    _
      .sortBy(result.errors, 'property')
      .forEach((error, index) => {
        table.cell('#', index + 1)
        table.cell('Property', error.property)
        table.cell('Error', error.message)
        table.newRow()
      })

    console.log(table.toString())
  }
}

module.exports = {
  command: 'validate',
  description: 'validte the current plugin exports',
  handler
}
