const serve = require('../utils/serve')

function builder (yargs) {
  yargs
    .positional('path', {
      description: 'server file path',
      type: 'string'
    })
    .option('port', {
      alias: 'p',
      type: 'number',
      description: 'port number of the server'
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
