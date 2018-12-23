const shell = require('shelljs')
const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const splitLines = require('split-lines')
const _ = require('lodash')

module.exports = (workDirectory, name, options = {}) => {
  if (!options.skipInstall) {
    const result = shell.exec(`npm install ${name}`)

    if (result.code !== 0) {
      throw new Error()
    }
  }

  const serverFilePath = path.join(workDirectory, 'src', 'index.js')
  const server = fs.readFileSync(serverFilePath, 'utf-8')
  const lines = splitLines(server)
  const moduleName = _.camelCase(name)

  lines.unshift(`const ${moduleName} = require('${name}')`)

  const i = lines.indexOf('// register koop providers (placeholder)')
  lines.splice(i + 1, 0, `koop.register(${moduleName})`)

  fs.writeFileSync(serverFilePath, lines.join(os.EOL))
}
