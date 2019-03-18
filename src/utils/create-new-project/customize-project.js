const path = require('path')
const fs = require('fs-extra')
const writeJson = require('../write-formatted-json')

async function customizePackage (projectPath, type, name, options = {}) {
  const packagePath = path.join(projectPath, 'package.json')
  const packageConfig = await fs.readJson(packagePath)
  packageConfig.name = name

  // add npm script "start" if the provider project has a server option
  if (type === 'provider' && options.addServer) {
    packageConfig.scripts.start = 'node src/server.js'

    // add koop as a dependency since the original provider template does not
    // include it
    const koopConfig = await fs.readJson(path.join(projectPath, 'koop.json'))
    packageConfig.dependencies.koop = koopConfig.koopCompatibility
  }

  return writeJson(packagePath, packageConfig)
}

async function customizeProvider (projectPath, type, name, options = {}) {
  const configPath = path.join(projectPath, 'config/default.json')
  const config = await fs.readJson(configPath)

  config[name] = config['koop-cli-new-provider']
  delete config['koop-cli-new-provider']

  await writeJson(configPath, config)

  // add a server file to the koop provider project so the user does not have to
  // publish the provider and use it without koop-cli
  if (options.addServer) {
    const serverPath = path.join(__dirname, '../../templates', type, 'components/server.js')
    await fs.copy(serverPath, path.join(projectPath, 'src/server.js'))
  }
}

module.exports = async function customizeProject (path, type, name, options) {
  // update package.json
  await customizePackage(path, type, name, options)

  // update
  if (type === 'provider') {
    await customizeProvider(path, type, name, options)
  }
}
