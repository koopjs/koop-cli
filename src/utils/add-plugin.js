const shell = require('shelljs')
const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const splitLines = require('split-lines')
const _ = require('lodash')
const addConfig = require('./add-config')
const log = require('./log')

module.exports = async (cwd, name, options = {}) => {
  const koopConfig = await fs.readJson(path.join(cwd, 'koop.json'))

  if (koopConfig.type !== 'app') {
    throw new Error(`cannot add the plugin to a ${koopConfig.type} project`)
  }

  if (!options.skipInstall) {
    const result = shell.exec(`npm install --silent ${name}`)

    if (result.code !== 0) {
      throw new Error()
    }

    log(`\u2713 installed ${name}`, 'info', options)
  }

  if (options.config) {
    await updateConfig(cwd, name, options)
    log('\u2713 added plugin configuration', 'info', options)
  }

  await registerPlugin(cwd, name)

  log(`\u2713 registered ${name}`, 'info', options)
  log('\u2713 done', 'info', options)
}

async function updateConfig (cwd, name, options) {
  let config = {}

  if (options.addToRoot) {
    config = options.config
  } else {
    config[name] = options.config
  }

  return addConfig(cwd, config)
}

async function registerPlugin (cwd, name) {
  const pluginsFilePath = path.join(cwd, 'src', 'plugins.js')
  const plugins = await fs.readFile(pluginsFilePath, 'utf-8')
  const lines = splitLines(plugins.trim())

  const matched = name.match(/^((@.+\/)?([a-zA-Z0-9._-]+))(@.+)?$/)
  const fullName = matched[1]
  const shortName = _.camelCase(matched[3])

  lines.unshift(`const ${shortName} = require('${fullName}')`)

  const i = lines.indexOf(']')
  lines.splice(i, 0, `  ${shortName},`)

  return fs.writeFile(pluginsFilePath, lines.join(os.EOL))
}
