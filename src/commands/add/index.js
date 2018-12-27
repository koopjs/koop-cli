const path = require('path')
const fs = require('fs-extra')

// add helper functions
const addPlugin = require('./add-plugin')

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

  const workDirectory = process.cwd()
  const koopConfig = await fs.readJson(path.join(workDirectory, 'koop.json'))

  if (koopConfig.type === 'app') {
    return addPlugin(workDirectory, name, {
      config: argv.config,
      appendToRoot: argv.appendToRoot,
      skipInstall: argv.skipInstall
    })
  }
}
