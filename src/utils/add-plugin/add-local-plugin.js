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
  if (
    options.local &&
    !['auth', 'provider', 'output'].includes(type)
  ) {
    throw new Error(`No template exists for the given plugin type "${type}".`)
  }

  const componentSrcPath = path.join(__dirname, '../../template/components', type, 'src')
  const localComponentSrcPath = path.join(__dirname, '../../template/components', `${type}-local`, 'src')
  const pluginSrcPath = path.join(cwd, 'src', plugin.srcPath)

  if (await fs.pathExists(pluginSrcPath)) {
    // do nothing if the plugin files already exists
    return
  }

  // copy plugin files from the normal directory first
  await fs.copy(componentSrcPath, pluginSrcPath)

  // then copy files from the local plugin directory
  if (await fs.exists(localComponentSrcPath)) {
    await fs.copy(localComponentSrcPath, pluginSrcPath)
  }
}
