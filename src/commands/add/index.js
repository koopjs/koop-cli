const path = require('path')
const fs = require('fs-extra')

// add helper functions
const addProvider = require('./add-provider')

exports.options = (yargs) => {
  yargs
    .positional('type', {
      describe: 'component type',
      type: 'string',
      choices: ['provider']
    })
    .positional('name', {
      describe: 'component name',
      type: 'string'
    })
}

exports.handler = (argv) => {
  const type = argv.type
  const name = argv.name

  const workDirectory = process.cwd()
  const koopConfig = fs.readJsonSync(path.join(workDirectory, 'koop.json'))

  if (
    koopConfig.type === 'app' &&
    type === 'provider'
  ) {
    addProvider(workDirectory, name, {
      skipInstall: argv.skipInstall
    })
  }
}
