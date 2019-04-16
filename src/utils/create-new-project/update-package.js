const path = require('path')
const fs = require('fs-extra')
const writeJson = require('../write-formatted-json')

module.exports = async (projectPath, type, name) => {
  const packagePath = path.join(projectPath, 'package.json')
  const packageConfig = await fs.readJson(packagePath)
  packageConfig.name = name

  return writeJson(packagePath, packageConfig)
}
