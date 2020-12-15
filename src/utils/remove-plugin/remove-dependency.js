const path = require('path')
const fs = require('fs-extra')
const { removeDependency } = require('../manage-dependencies')
const writeJson = require('../write-formatted-json')

module.exports = async (cwd, plugin, options = {}) => {
  if (options.skipInstall) {
    const packageInfoPath = path.join(cwd, 'package.json')
    const packageInfo = await fs.readJson(packageInfoPath)

    const dependecies = packageInfo.dependencies
    delete dependecies[plugin.name]

    await writeJson(packageInfoPath, packageInfo)
  } else {
    await removeDependency(cwd, plugin.name)
  }
}
