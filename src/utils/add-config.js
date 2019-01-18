const path = require('path')
const fs = require('fs-extra')

module.exports = async (cwd, newConfig, options = {}) => {
  const configName = options.configName || 'default'
  const configPath = path.join(cwd, `config/${configName}.json`)

  let config = {}

  if (await fs.pathExists(configPath)) {
    config = await fs.readJson(configPath)
  }

  config = Object.assign(config, newConfig)

  return fs.writeJson(configPath, config)
}
