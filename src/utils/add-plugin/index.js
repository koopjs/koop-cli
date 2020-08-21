const fs = require('fs-extra')
const path = require('path')
const addLocalPlugin = require('./add-local-plugin')
const addNpmPlugin = require('./add-npm-plugin')
const registerPlugin = require('./register-plugin')
const updateProjectConfig = require('../update-project-config')
const log = require('../log')
const parsePluginName = require('./parser-plugin-name')
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

  /**
   * Install plugin
   */

  let plugin

  if (options.local) {
    plugin = parsePluginPath(nameOrPath)
    await addLocalPlugin(cwd, type, plugin, options)
  } else {
    plugin = parsePluginName(nameOrPath)
    await addNpmPlugin(cwd, type, plugin, options)
  }

  log(`\u2713 added ${plugin.moduleName}`, 'info', options)

  /**
   * Add plugin config
   */

  await updateProjectConfig(cwd, type, plugin.fullModuleName, options.config)
  log('\u2713 added plugin configuration', 'info', options)

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
