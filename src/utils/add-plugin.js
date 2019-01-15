const shell = require('shelljs')
const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const splitLines = require('split-lines')
const _ = require('lodash')
const addConfig = require('./add-config')

module.exports = async (cwd, name, options = {}) => {
  const koopConfig = await fs.readJson(path.join(cwd, 'koop.json'))

  if (koopConfig.type !== 'app') {
    throw new Error(`cannot add the plugin to a ${koopConfig.type} project`)
  }

  if (!options.skipInstall) {
    const result = shell.exec(`npm install ${name}`)

    if (result.code !== 0) {
      throw new Error()
    }
  }

  if (options.config) {
    options.config = typeof options.config === 'string'
      ? JSON.parse(options.config)
      : options.config

    await updateConfig(cwd, name, options)
  }

  await updateJS(cwd, name)
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

async function updateJS (cwd, name) {
  const pluginsFilePath = path.join(cwd, 'src', 'plugins.js')
  const plugins = await fs.readFile(pluginsFilePath, 'utf-8')
  const lines = splitLines(plugins.trim())
  const moduleName = _.camelCase(name.match(/(@.+\/)?(.+)/)[2])

  lines.unshift(`const ${moduleName} = require('${name}')`)

  const i = lines.indexOf(']')
  lines.splice(i, 0, `  ${moduleName},`)

  return fs.writeFile(pluginsFilePath, lines.join(os.EOL))
}
