const path = require('path')
const fs = require('fs-extra')

/**
 * Add the given plugin from a local path.
 * @param {string} cwd     app directory
 * @param {string} type    plugin type
 * @param {Object} plugin  plugin information
 * @param {Object} options options
 */
module.exports = async function addLocalPlugin (cwd, type, plugin, options = {}) {
  const pluginSrcPath = path.join(cwd, 'src', plugin.srcPath)

  if (
    await fs.pathExists(pluginSrcPath) ||
    await fs.pathExists(`${pluginSrcPath}.js`)
  ) {
    throw new Error(`File path alread exists: ${pluginSrcPath}`)
  }

  if (
    options.local &&
    !['auth', 'provider', 'output'].includes(type)
  ) {
    throw new Error(`No template exists for the given plugin type "${type}".`)
  }

  const componentPath = path.join(__dirname, '../../template/components', type)
  const pluginTestPath = path.join(cwd, 'test', plugin.srcPath)

  // copy components
  await fs.copy(path.join(componentPath, 'src'), pluginSrcPath)
  await fs.copy(path.join(componentPath, 'test'), pluginTestPath)
}
