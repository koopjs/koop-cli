const path = require('path')
const fs = require('fs-extra')
const recast = require('recast')
const writeAST = require('../write-ast')
const getPluginListName = require('../get-plugin-list-name')

module.exports = async (cwd, plugin) => {
  const pluginsFilePath = path.join(cwd, 'src/plugins.js')
  const pluginsFile = await fs.readFile(pluginsFilePath, 'utf-8')
  const ast = recast.parse(pluginsFile)

  /**
   * find out the line "const pluginObject = require('path')()" and remove it
   */

  const requireStatementIndex = ast.program.body.findIndex((statement) => {
    if (statement.type !== 'VariableDeclaration') {
      return
    }

    if (statement.declarations[0].init.type !== 'CallExpression') {
      return
    }

    const initializeFunc = statement.declarations[0].init
    const requireFunc = initializeFunc.callee
    const requirePath = requireFunc.arguments[0].value

    return requirePath.includes(plugin.srcPath)
  })

  // skip if not found (happens in plugins.js created by older CLI version <0.7.0)
  if (requireStatementIndex === -1) {
    return
  }

  const pluginInstance = ast.program.body[requireStatementIndex].declarations[0].id.name
  ast.program.body.splice(requireStatementIndex, 1)

  /**
   * find out the pluginObject in the plugin list and remove it
   */

  const pluginListName = getPluginListName(plugin.type)
  const pluginList = ast
    .program
    .body
    .find((statement) => {
      return statement.declarations[0].id.name === pluginListName
    })
    .declarations[0]
    .init
    .elements

  const instanceIndex = pluginList.findIndex((plugin) => plugin.name === pluginInstance)
  pluginList.splice(instanceIndex, 1)

  await writeAST(pluginsFilePath, ast)
}
