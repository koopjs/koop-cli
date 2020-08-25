const path = require('path')
const _ = require('lodash')
const recast = require('recast')
const fs = require('fs-extra')
const writeAST = require('./write-ast')

// AST builders
const astBuilders = recast.types.builders

// Different plugins should be registered in ordered lists based on their type
const pluginLists = {
  output: 'outputs',
  auth: 'auths',
  cache: 'caches'
}
/**
 * Register the plugin into the app.
 * @param  {string} cwd          project directory
 * @param  {string} type         plugin type
 * @param  {Object} plugin       plugin name information
 * @param  {Object} [options={}] options
 * @return {Promise}             promise
 */
async function registerPlugin (cwd, type, plugin) {
  const pluginsFilePath = path.join(cwd, 'src', 'plugins.js')
  const pluginInitalizerPath = `./${plugin.srcPath}/initialize`

  const pluginsFile = await fs.readFile(pluginsFilePath, 'utf-8')
  const ast = recast.parse(pluginsFile)

  // module name with no scope
  const shortName = _.camelCase(plugin.moduleName)

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
        astBuilders.callExpression(
          astBuilders.identifier('require'),
          [
            astBuilders.literal(pluginInitalizerPath)
          ]
        ),
        []
      )
    )
  ])

  // push it as the first line of the source code
  ast.program.body.unshift(importPlugin)

  /**
   * Update the AST to add the imported plugin to a plugin list:
   * 1. traverse the AST and find the correct plugin list
   * 2. push the plugin to the plugin list
   */

  // pick the correct plugin list name based on the plugin type
  const listName = type in pluginLists ? pluginLists[type] : 'plugins'

  // find the plugin list from the AST (using the simple logic because we know
  // the plugin list is declared at the top-most level)
  const pluginList = ast.program.body.find((line) => {
    // find a variable declaration with the list name
    return line.type === 'VariableDeclaration' &&
      line.declarations[0].id.name === listName
  })

  // push the plugin object to the element array of the plugin list
  pluginList.declarations[0].init.elements.push(astBuilders.identifier(shortName))

  return writeAST(pluginsFilePath, ast)
}

module.exports = registerPlugin
