const serve = require('../utils/serve')

function builder (yargs) {
  yargs
    .positional('path', {
      description: 'server file path',
      type: 'string'
    })
    .option('port', {
      type: 'number',
      default: 8080,
      description: 'port number of the server'
    })
    .option('data', {
      type: 'string',
      default: 'test/data.geojson',
      description: 'path to a GeoJSON data file for testing Koop plugin'
    })
    .option('debug', {
      type: 'boolean',
      description: 'enable nodejs inspector for debugging'
    })
    .option('watch', {
      type: 'boolean',
      description: 'enable auto-restart on file change'
    })
}

async function handler (argv = {}) {
  try {
    await serve(process.cwd(), argv)
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  command: 'serve [path]',
  description: 'run a koop server for the current project',
  builder,
  handler
}
