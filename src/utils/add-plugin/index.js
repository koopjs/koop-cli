const fs = require('fs-extra')
const path = require('path')
const addLocalPlugin = require('./add-local-plugin')
const addNpmPlugin = require('./add-npm-plugin')
const registerPlugin = require('./register-plugin')
const addConfig = require('../add-config')
const log = require('../log')

/**
 * Add a plugin to the current koop project.
 * @param  {string}  cwd          koop project directory
 * @param  {string}  type         plugin type
 * @param  {string}  nameOrPath   plugin name or path
 * @param  {Object}  [options={}] options
 * @param  {boolean} [options.local]  local file path of the plugin
 * @param  {Object}  [options.config] plugin configuration
 * @param  {boolean} [options.skipInstall]  skip plugin installation
 * @param  {boolean} [options.addToRoot]  add plugin configuration to the app root configuration
 * @param  {boolean} [options.routePrefix]  URL prefix for register routes
 * @return {Promise}              a promise
 */
module.exports = async (cwd, type, nameOrPath, options = {}) => {
  const koopConfig = await fs.readJson(path.join(cwd, 'koop.json'))

  if (koopConfig.type !== 'app') {
    throw new Error(`cannot add the plugin to a ${koopConfig.type} project`)
  }

  /**
   * Install plugin
   */

  let pluginInfo

  if (options.local) {
    pluginInfo = parsePluginPath(nameOrPath)
    await addLocalPlugin(cwd, type, pluginInfo, options)
  } else {
    pluginInfo = parsePluginName(nameOrPath)
    await addNpmPlugin(cwd, type, pluginInfo, options)
  }

  log(`\u2713 added ${pluginInfo.moduleName}`, 'info', options)

  /**
   * Add plugin config (if any)
   */

  if (options.config) {
    await updateConfig(cwd, pluginInfo.configName, options)
    log('\u2713 added configuration', 'info', options)
  }

  /**
   * Register plugin to the app
   */

  await registerPlugin(cwd, type, pluginInfo, options)

  log(`\u2713 registered ${pluginInfo.moduleName}`, 'info', options)

  /**
   * Done
   */

  log('\u2713 done', 'info', options)
}

/**
 * Parse the given plugin name and return name components.
 * @param  {string} name module name
 * @return {Object}      name components
 */
function parsePluginName (pluginName) {
  const matches = pluginName.match(/^((@.+\/)?([a-zA-Z0-9._-]+))(@(.+))?$/)
  const components = {
    requireName: matches[1],
    fullName: matches[1],
    configName: matches[1],
    moduleName: matches[3]
  }

  if (matches[5]) {
    components.versionedFullName = matches[0]
    components.version = matches[5]
  }

  return components
}

/**
 * Parse plugin path.
 * @param  {string} pluginPath plugin file path
 * @return {Object}            name components
 */
function parsePluginPath (pluginPath) {
  const components = {
    requireName: pluginPath.startsWith('./') ? pluginPath : `./${pluginPath}`,
    configName: path.basename(pluginPath),
    fullName: pluginPath,
    moduleName: path.basename(pluginPath)
  }

  return components
}

/**
 * Update plugin config.
 * @param  {string} cwd     project directory
 * @param  {string} name    config name
 * @param  {Object} options options
 * @return {Promise}        promise
 */
async function updateConfig (cwd, name, options) {
  let config = {}

  if (options.addToRoot) {
    config = options.config
  } else {
    config[name] = options.config
  }

  return addConfig(cwd, config)
}
