const fs = require('fs-extra')
const path = require('path')
const os = require('os')
const _ = require('lodash')
const recast = require('recast')
const execa = require('execa')
const latestVersion = require('latest-version')
const addConfig = require('./add-config')
const log = require('./log')
const scripts = require('./scripts')
const writeJson = require('./write-formatted-json')

// AST builders
const astBuilders = recast.types.builders

/**
 * Add a plugin to the current koop project.
 * @param  {string}  cwd          koop project directory
 * @param  {string}  type         plugin type
 * @param  {string}  name         plugin name
 * @param  {Object}  [options={}] options
 * @param  {Object}  [options.config] plugin configuration
 * @param  {boolean} [options.skipInstall]  skip plugin installation
 * @param  {boolean} [options.addToRoot]  add plugin configuration to the app root configuration
 * @param  {boolean} [options.routePrefix]  URL prefix for register routes
 * @return {Promise}              a promise
 */
module.exports = async (cwd, type, name, options = {}) => {
  const koopConfig = await fs.readJson(path.join(cwd, 'koop.json'))

  if (koopConfig.type !== 'app') {
    throw new Error(`cannot add the plugin to a ${koopConfig.type} project`)
  }

  await addPlugin(cwd, name, options)
  log(`\u2713 added ${name}`, 'info', options)

  if (options.config) {
    await updateConfig(cwd, name, options)
    log('\u2713 added configuration', 'info', options)
  }

  await registerPlugin(cwd, type, name, options)

  log(`\u2713 registered ${name}`, 'info', options)
  log('\u2713 done', 'info', options)
}

async function updateConfig (cwd, name, options) {
  let config = {}

  if (options.addToRoot) {
    config = options.config
  } else {
    config[name] = options.config
  }

  return addConfig(cwd, config)
}

/**
 * Add the given plugin to the project.
 * @param {string} cwd     app directory
 * @param {string} name    plugin name
 * @param {Object} options options
 */
async function addPlugin (cwd, name, options = {}) {
  if (options.skipInstall) {
    const packageInfoPath = path.join(cwd, 'package.json')
    const packageInfo = await fs.readJson(packageInfoPath)
    const nameComponents = parseModuleName(name)

    let options

    if (nameComponents.version) {
      options = {
        version: nameComponents.version
      }
    }

    const pluginVersion = await latestVersion(nameComponents.fullName, options)
    packageInfo.dependencies[nameComponents.fullName] = `^${pluginVersion}`

    await writeJson(packageInfoPath, packageInfo)
  } else {
    const script = scripts.NPM_INSTALL
    await execa.shell(`${script} ${name}`, { cwd })
  }
}

async function registerPlugin (cwd, type, name, options = {}) {
  const pluginsFilePath = path.join(cwd, 'src', 'plugins.js')
  const pluginsFile = await fs.readFile(pluginsFilePath, 'utf-8')
  const ast = recast.parse(pluginsFile)

  const nameComponents = parseModuleName(name)
  // module name with no scope
  const shortName = _.camelCase(nameComponents.moduleName)

  /**
   * Update the AST to import the plugin library:
   * 1. create an AST representation of "const plugin = require('pluginLib')"
   * 2. push it to the first line of the source code
   */

  // use "const" to declare a variable
  const importPlugin = astBuilders.variableDeclaration('const', [
    astBuilders.variableDeclarator(
      // the variable name is the module name without any scope
      astBuilders.identifier(shortName),
      // the object comes from a function call
      astBuilders.callExpression(
        // function name is "require"
        astBuilders.identifier('require'),
        // function parameter is the full plugin module name
        [astBuilders.literal(nameComponents.fullName)]
      )
    )
  ])

  // push it as the first line of the source code
  ast.program.body.unshift(importPlugin)

  /**
   * Update the AST to add the imported plugin to a plugin list:
   * 1. create a plugin object with the plugin instance and options
   * 2. traverse the AST and find the correct plugin list
   * 3. push the plugin object to the plugin list
   */

  // get the plugin object
  const pluginObject = createPluginObject(type, shortName, options)

  // pick the correct plugin list name based on the plugin type
  const listName = type === 'output' ? 'outputs' : 'plugins'

  // find the plugin list from the AST (using the simple logic because we know
  // the plugin list is declared at the top-most level)
  const pluginList = ast.program.body.find((line) => {
    // find a variable declaration with the list name
    return line.type === 'VariableDeclaration' &&
      line.declarations[0].id.name === listName
  })

  // push the plugin object to the element array of the plugin list
  pluginList.declarations[0].init.elements.push(pluginObject)

  // print the code from the AST
  const output = recast
    // @NOTE should not hard code the coding style, but the new lines follow
    // a pattern favored by the writer and the user should handle it later
    .prettyPrint(ast, { tabWidth: 2, quote: 'single' })
    .code
    // recast has an issue(?) to add extra line breaks when printing the code:
    // https://githuastBuilders.com/benjamn/recast/issues/534
    .replace(/\r?\n\r?\n/g, os.EOL)

  // overwrite the original file with the new code
  return fs.writeFile(pluginsFilePath, output)
}

/**
 * Parse the given module name and return name components.
 * @param  {string} name module name
 * @return {Object}      name components
 */
function parseModuleName (name) {
  const matches = name.match(/^((@.+\/)?([a-zA-Z0-9._-]+))(@(.+))?$/)
  const components = {
    fullName: matches[1],
    moduleName: matches[3]
  }

  if (matches[5]) {
    components.version = matches[5]
  }

  return components
}

/**
 * Create a plugin object.
 * @param  {string} type         plugin type
 * @param  {string} name         plugin variable name
 * @param  {Object} [options={}] options
 * @return {Object}              plugin object in AST
 *
 * @example plugin object
 *  {
 *    "instance": plugin,
 *    "options": {}
 *  }
 */
function createPluginObject (type, name, options = {}) {
  // property list for the plugin object
  const astProperties = [
    // add the property "instance: moduleName"
    astBuilders.property(
      'init',
      astBuilders.identifier('instance'),
      astBuilders.identifier(name)
    )
  ]

  const pluginOptions = createPluginOptions(type, options)

  if (pluginOptions) {
    // if there is any option, add another property "options: {...}"
    astProperties.push(astBuilders.property(
      'init',
      astBuilders.identifier('options'),
      pluginOptions)
    )
  }

  // create the plugin object in AST
  return astBuilders.objectExpression(astProperties)
}

/**
 * Create option object.
 * @param  {string} type         plugin type
 * @param  {Object} [options={}] options
 * @return {Object}              plugin object in AST, if there is no option, returns null
 */
function createPluginOptions (type, options = {}) {
  const pluginOptions = {}

  // recongize any option for the given plugin type
  if (type === 'provider' && typeof options.routePrefix === 'string') {
    pluginOptions.routePrefix = options.routePrefix
  }

  // exit if no option is found
  if (_.isEmpty(pluginOptions)) {
    return null
  }

  // property list for the options object
  const astProperties = []

  // add each option to the property list
  for (const name in pluginOptions) {
    const value = pluginOptions[name]
    astProperties.push(astBuilders.property(
      'init',
      astBuilders.identifier(name),
      astBuilders.literal(value))
    )
  }

  // create the options object
  return astBuilders.objectExpression(astProperties)
}
