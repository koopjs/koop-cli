const fs = require('fs-extra')
const path = require('path')
const addLocalPlugin = require('./add-local-plugin')
const addNpmPlugin = require('./add-npm-plugin')
const registerPlugin = require('./register-plugin')
const updateProjectConfig = require('../update-project-config')
const addPluginInitializer = require('./add-plugin-initializer')
const log = require('../log')
const parsePluginName = require('./parse-plugin-name')
const parsePluginPath = require('./parse-plugin-path')

/**
 * Add a plugin to the current koop project.
 * @param  {string}  cwd          koop project directory
 * @param  {string}  type         plugin type
 * @param  {string}  nameOrPath   plugin name or path
 * @param  {Object}  [options={}] options
 * @param  {boolean} [options.local]  local file path of the plugin
 * @param  {Object}  [options.config] plugin configuration
 * @param  {boolean} [options.skipInstall]  skip plugin installation
 * @param  {boolean} [options.routePrefix]  URL prefix for register routes
 * @return {Promise}              a promise
 */
module.exports = async (cwd, type, nameOrPath, options = {}) => {
  const koopConfig = await fs.readJson(path.join(cwd, 'koop.json'))

  if (koopConfig.type !== 'app') {
    throw new Error(`cannot add the plugin to a ${koopConfig.type} project`)
  }

  options.npmClient = options.npmClient || koopConfig.npmClient

  const plugin = options.local ? parsePluginPath(nameOrPath) : parsePluginName(nameOrPath)

  /**
   * Check if the plugin directory has been occupied
   */

  const pluginSrcPath = path.join(cwd, 'src', plugin.srcPath)

  if (await fs.pathExists(pluginSrcPath)) {
    throw new Error(`Directory already exists: ${path.normalize(pluginSrcPath)}`)
  }

  /**
   * Install plugin
   */

  if (options.local) {
    await addLocalPlugin(cwd, type, plugin, options)
  } else {
    await addNpmPlugin(cwd, type, plugin, options)
  }

  log(`\u2713 added ${plugin.moduleName}`, 'info', options)

  /**
   * Add plugin config
   */

  await updateProjectConfig(cwd, type, plugin.fullModuleName, options.config)
  log('\u2713 added plugin configuration', 'info', options)

  /**
   * Add the initializer.js for the plugin
   */
  await addPluginInitializer(cwd, type, plugin, options)

  /**
   * Register plugin to the app
   */

  await registerPlugin(cwd, type, plugin, options)
  log(`\u2713 registered ${plugin.moduleName}`, 'info', options)

  /**
   * Done
   */

  log('\u2713 done', 'info', options)
}
