const path = require('path')
const fs = require('fs-extra')
const writeJSON = require('../write-formatted-json')

module.exports = async (cwd, plugin) => {
  const koopConfigPath = path.join(cwd, 'koop.json')
  const koopConfig = await fs.readJSON(koopConfigPath)

  const index = koopConfig.plugins.findIndex((existing) => existing.name === plugin.name)
  koopConfig.plugins.splice(index, 1)

  await writeJSON(koopConfigPath, koopConfig)
}
