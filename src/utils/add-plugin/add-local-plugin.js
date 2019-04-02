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
  const pluginSrcPath = path.join(cwd, 'src', plugin.fullName)

  if (
    await fs.pathExists(pluginSrcPath) ||
    await fs.pathExists(`${pluginSrcPath}.js`)
  ) {
    return
  }

  const templatePath = path.join(__dirname, '../../templates', type, 'components')
  const pluginTestPath = path.join(cwd, 'test', plugin.fullName)

  // copy components
  await fs.copy(path.join(templatePath, 'src'), pluginSrcPath)
  await fs.copy(path.join(templatePath, 'test'), pluginTestPath)
}
