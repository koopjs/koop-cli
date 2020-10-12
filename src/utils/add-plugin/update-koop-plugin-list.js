const path = require('path')
const fs = require('fs-extra')
const writeJSON = require('../write-formatted-json')

module.exports = async (cwd, type, plugin, options = {}) => {
  const koopConfigPath = path.join(cwd, 'koop.json')
  const koopConfig = await fs.readJSON(koopConfigPath)

  if (!koopConfig.plugins) {
    koopConfig.plugins = []
  }

  koopConfig.plugins.push({
    type,
    name: plugin.fullModuleName,
    srcPath: plugin.srcPath,
    local: !!options.local
  })

  await writeJSON(koopConfigPath, koopConfig)
}
