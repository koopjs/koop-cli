const shell = require('shelljs')
const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const splitLines = require('split-lines')
const _ = require('lodash')

module.exports = async (workDirectory, name, options = {}) => {
  if (!options.skipInstall) {
    const result = shell.exec(`npm install ${name}`)

    if (result.code !== 0) {
      throw new Error()
    }
  }

  if (options.config) {
    const config = typeof options.config === 'string'
      ? JSON.parse(options.config)
      : options.config

    await updateConfig(workDirectory, name, config, options.appendToRoot)
  }

  await updateJS(workDirectory, name)
}

async function updateConfig (workDirectory, name, config, appendToRoot) {
  const configPath = path.join(workDirectory, 'config', 'default.json')
  let appConfig = await fs.readJson(configPath)

  if (appendToRoot) {
    appConfig = Object.assign(appConfig, config)
  } else {
    appConfig[name] = config
  }

  return fs.writeJson(configPath, appConfig)
}

async function updateJS (workDirectory, name) {
  const pluginsFilePath = path.join(workDirectory, 'src', 'plugins.js')
  const plugins = await fs.readFile(pluginsFilePath, 'utf-8')
  const lines = splitLines(plugins.trim())
  const moduleName = _.camelCase(name.match(/(@.+\/)?(.+)/)[2])

  lines.unshift(`const ${moduleName} = require('${name}')`)

  const i = lines.indexOf(']')
  lines.splice(i, 0, `  ${moduleName},`)

  return fs.writeFile(pluginsFilePath, lines.join(os.EOL))
}
