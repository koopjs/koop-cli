const path = require('path')
const fs = require('fs-extra')
const writeJson = require('../write-formatted-json')

module.exports = async (projectPath, type, name) => {
  if (type === 'app') {
    return
  }

  const configPath = path.join(projectPath, 'config/default.json')
  const config = await fs.readJson(configPath)

  // create a config namespace of this plugin
  config[name] = {}

  return writeJson(configPath, config)
}
