const path = require('path')
const fs = require('fs-extra')
const writeJson = require('../write-formatted-json')

module.exports = async (projectPath, type, name, options) => {
  const configPath = path.join(projectPath, 'koop.json')
  const config = await fs.readJson(configPath)

  if (options.npmClient) {
    config.npmClient = options.npmClient
  }

  return writeJson(configPath, config)
}
