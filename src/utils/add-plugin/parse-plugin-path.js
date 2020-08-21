const path = require('path')

/**
 * Parse plugin path.
 * @param  {string} pluginPath plugin file path
 * @return {Object}            name components
 */
function parsePluginPath (pluginPath) {
  const moduleName = path.basename(pluginPath)

  return {
    moduleName,
    fullModuleName: moduleName,
    srcPath: path.normalize(pluginPath)
  }
}

module.exports = parsePluginPath
