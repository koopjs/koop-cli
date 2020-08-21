const path = require('path')
const _ = require('lodash')
const recast = require('recast')
const writeAST = require('./write-ast')

// AST builders
const astBuilders = recast.types.builders

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

async function addPluginInitializer (cwd, type, plugin, options = {}) {
  const ast = recast.parse('')

  // module name with no scope
  const shortName = _.camelCase(plugin.moduleName)

  /**
 * Update the AST to import the plugin library:
 * 1. create an AST representation of "const plugin = require('plugin-package')"
 * 2. push it to the first line of the source code
 */

  // use "const" to declare a variable
  const requirePath = options.local ? ['.', 'index'].join(path.sep) : plugin.fullModuleName
  const importPlugin = astBuilders.variableDeclaration('const', [
    astBuilders.variableDeclarator(
      // the variable name is the module name without any scope
      astBuilders.identifier(shortName),
      // the object comes from a function call
      astBuilders.callExpression(
        // function name is "require"
        astBuilders.identifier('require'),
        // function parameter is the full plugin module name
        [astBuilders.literal(requirePath)]
      )
    )
  ])

  ast.program.body.push(importPlugin)

  // create init function
  const createInitFunc = astBuilders.functionDeclaration(
    astBuilders.identifier('initialize'),
    [],
    astBuilders.blockStatement([
      astBuilders.returnStatement(createPluginObject(type, shortName, options))
    ])
  )

  ast.program.body.push(createInitFunc)

  // create exports
  const exportInitFunc = astBuilders.expressionStatement(
    astBuilders.assignmentExpression(
      '=',
      astBuilders.memberExpression(
        astBuilders.identifier('module'),
        astBuilders.identifier('exports')
      ),
      astBuilders.identifier('initialize')
    )
  )

  ast.program.body.push(exportInitFunc)

  const initializerPath = path.join(cwd, 'src', plugin.srcPath, 'initialize.js')
  return writeAST(initializerPath, ast)
}

module.exports = addPluginInitializer
