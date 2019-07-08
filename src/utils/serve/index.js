const path = require('path')
const fs = require('fs-extra')
const getProvider = require('./get-provider')
const exec = require('../exec-realtime')

module.exports = async (cwd, options = {}) => {
  const configPath = path.join(cwd, 'koop.json')
  const koopConfig = await fs.readJson(configPath)

  if (options.path) {
    // run the test server file if provided
    const serverPath = path.join(cwd, options.path)
    exec(`node ${serverPath}`)
  } else if (koopConfig.type === 'app') {
    // if it is an app, run it directly
    const packageInfo = await fs.readJson(path.join(cwd, 'package.json'))
    const appPath = path.join(cwd, packageInfo.main)
    exec(`node ${appPath}`)
  } else {
    // otherwise, this is a plugin and we should create a Koop server for it
    const Koop = require('koop')
    const koop = new Koop()
    const packageInfo = await fs.readJson(path.join(cwd, 'package.json'))
    const plugin = require(path.join(cwd, packageInfo.main))

    // register the current plugin
    koop.register(plugin)

    // note that a default output is provided by the koop-core
    // (https://github.com/koopjs/koop-output-geoservices), a provider is still
    // needed and here we provide a simple GeoJSON provider
    if (koopConfig.type !== 'provider') {
      const dataPath = options.data

      if (
        !dataPath ||
        !dataPath.endsWith('.geojson') ||
        !(await fs.pathExists(path.join(cwd, dataPath)))
      ) {
        throw new Error('A GeoJSON file is requried to provide test data for the dev server.')
      }

      koop.register(await getProvider(path.join(cwd, dataPath)))
    }

    const serverPort = options.port || 8080

    koop.server.listen(serverPort, () => {
      console.log(`Server listening at http://localhost:${serverPort}`)
    })
  }
}
