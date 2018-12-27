const shell = require('shelljs')
const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const splitLines = require('split-lines')
const _ = require('lodash')

module.exports = async (workDirectory, name, options = {}) => {
  if (!options.skipInstall) {
    const result = shell.exec(`npm install ${name}`)

    if (result.code !== 0) {
      throw new Error()
    }
  }

  const pluginsFilePath = path.join(workDirectory, 'src', 'plugins.js')
  const plugins = await fs.readFile(pluginsFilePath, 'utf-8')
  const lines = splitLines(plugins.trim())
  const moduleName = _.camelCase(name)

  lines.unshift(`const ${moduleName} = require('${name}')`)

  const i = lines.indexOf(']')
  lines.splice(i, 0, `  ${moduleName},`)

  return fs.writeFile(pluginsFilePath, lines.join(os.EOL))
}
