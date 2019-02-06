const fs = require('fs-extra')
const path = require('path')
const os = require('os')
const _ = require('lodash')
const recast = require('recast')
const execa = require('execa')
const addConfig = require('./add-config')
const log = require('./log')
const scripts = require('./scripts')

// AST builder
const b = recast.types.builders

/**
 * Add a plugin to the current koop project.
 * @param  {string}  cwd          koop project directory
 * @param  {string}  type         plugin type
 * @param  {string}  name         plugin name
 * @param  {Object}  [options={}] options
 * @param  {Object}  [options.config] plugin configuration
 * @param  {boolean} [options.addToRoot]  add plugin configuration to the app root configuration
 * @param  {boolean} [options.routePrefix]  URL prefix for register routes
 * @return {Promise}              a promise
 */
module.exports = async (cwd, type, name, options = {}) => {
  const koopConfig = await fs.readJson(path.join(cwd, 'koop.json'))

  if (koopConfig.type !== 'app') {
    throw new Error(`cannot add the plugin to a ${koopConfig.type} project`)
  }

  if (!options.skipInstall) {
    const script = scripts.NPM_INSTALL
    await execa.shell(`${script} ${name}`, { cwd })
    log(`\u2713 installed ${name}`, 'info', options)
  }

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

async function registerPlugin (cwd, type, name, options = {}) {
  const pluginsFilePath = path.join(cwd, 'src', 'plugins.js')
  const pluginsFile = await fs.readFile(pluginsFilePath, 'utf-8')
  const ast = recast.parse(pluginsFile)

  /**
   * Add the plugin using the AST
   */
  const matched = name.match(/^((@.+\/)?([a-zA-Z0-9._-]+))(@.+)?$/)
  // full module name with the scope
  const fullName = matched[1]
  // module name with no scope
  const shortName = _.camelCase(matched[3])

  // add the code to import the library
  const importPlugin = b.variableDeclaration('const', [
    b.variableDeclarator(b.identifier(shortName), b.callExpression(
      b.identifier('require'),
      [b.literal(fullName)]
    ))
  ])
  ast.program.body.unshift(importPlugin)

  // add the code to put the plugin library into the plugin list
  const pluginObject = createPluginObject(type, shortName, options)
  const listId = type === 'output' ? 'outputs' : 'plugins'
  // find the correct plugin list based on the plugin type
  const pluginList = ast.program.body.find((line) => {
    return line.type === 'VariableDeclaration' &&
      line.declarations[0].id.name === listId
  })
  pluginList.declarations[0].init.elements.push(pluginObject)

  // print the code from the AST
  const output = recast
    // @NOTE should not hard code the coding style, but the new lines follow
    // a pattern favored by the writer and the user should handle it later
    .prettyPrint(ast, { tabWidth: 2, quote: 'single' })
    .code
    // recast has an issue(?) to add extra line breaks when printing the code:
    // https://github.com/benjamn/recast/issues/534
    .replace(/\r?\n\r?\n/g, os.EOL)

  // overwrite the original file with the new code
  return fs.writeFile(pluginsFilePath, output)
}

function createPluginObject (type, name, options = {}) {
  const astProperties = [
    b.property('init', b.identifier('instance'), b.identifier(name))
  ]

  const pluginOptions = createPluginOptions(type, options)

  if (pluginOptions) {
    astProperties.push(b.property('init', b.identifier('options'), pluginOptions))
  }

  return b.objectExpression(astProperties)
}

function createPluginOptions (type, options = {}) {
  const pluginOptions = {}

  if (type === 'provider' && typeof options.routePrefix === 'string') {
    pluginOptions.routePrefix = options.routePrefix
  }

  if (_.isEmpty(pluginOptions)) {
    return null
  }

  const astProperties = []

  for (const name in pluginOptions) {
    const value = pluginOptions[name]
    astProperties.push(b.property('init', b.identifier(name), b.literal(value)))
  }

  return b.objectExpression(astProperties)
}
