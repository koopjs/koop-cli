const path = require('path')
const fs = require('fs-extra')

// add helper functions
const addPlugin = require('./add-plugin')

exports.options = (yargs) => {
  yargs
    .positional('name', {
      describe: 'plugin name',
      type: 'string'
    })
}

exports.handler = async (argv) => {
  const name = argv.name

  const workDirectory = process.cwd()
  const koopConfig = await fs.readJson(path.join(workDirectory, 'koop.json'))

  if (koopConfig.type === 'app') {
    return addPlugin(workDirectory, name, {
      skipInstall: argv.skipInstall
    })
  }
}
