/**
 * Parse the given plugin name and return name components.
 * @param  {string} name module name
 * @return {Object}      name components
 */
function parsePluginName (pluginName) {
  /**
   * The following regex parses the "@org/test@^1.2.3" into
   * [0] @org/test@^1.2.3
   * [1] @org/test
   * [3] test
   * [5] ^1.2.3
   */
  const matches = pluginName.match(/^((@.+\/)?([a-zA-Z0-9._-]+))(@(.+))?$/)

  if (!matches) {
    throw new Error(`Invaid plugin module name: ${pluginName}`)
  }

  const installationName = matches[0]
  const fullModuleName = matches[1]
  const moduleName = matches[3]
  const version = matches[5]

  return {
    installationName,
    fullModuleName,
    moduleName,
    version,
    srcPath: moduleName
  }
}

module.exports = parsePluginName
