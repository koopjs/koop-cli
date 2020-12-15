const path = require('path')
const fs = require('fs-extra')

module.exports = async (cwd) => {
  const packageInfo = await fs.readJson(path.join(cwd, 'package.json'))
  const mainEntry = packageInfo.main
  const plugin = require(path.join(cwd, mainEntry))
  const pluginInstance = typeof plugin === 'function' ? plugin() : plugin
  return pluginInstance
}
