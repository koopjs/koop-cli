const Koop = require('koop')
const path = require('path')
const fs = require('fs-extra')
const getProvider = require('./get-provider')
const exec = require('../exec-realtime')

module.exports = async (cwd, options = {}) => {
  const configPath = path.join(cwd, 'koop.json')
  const koopConfig = await fs.readJson(configPath)

  if (options.path) {
    const serverPath = path.join(cwd, options.path)
    exec(`node ${serverPath}`)
  } else if (koopConfig.type === 'app') {
    const packageInfo = await fs.readJson(path.join(cwd, 'package.json'))
    const appPath = path.join(cwd, packageInfo.main)
    exec(`node ${appPath}`)
  } else {
    const koop = new Koop()
    const packageInfo = await fs.readJson(path.join(cwd, 'package.json'))
    const plugin = require(path.join(cwd, packageInfo.main))

    koop.register(plugin)

    if (koopConfig.type !== 'provider') {
      const dataPath = options.data

      if (
        !dataPath ||
        !dataPath.endsWith('.geojson') ||
        !(await fs.pathExists(path.join(cwd, dataPath)))
      ) {
        throw new Error('A GeoJSON test data is requried for the dev server.')
      }

      koop.register(await getProvider(path.join(cwd, dataPath)))
    }

    const serverPort = options.port || 8080

    koop.server.listen(serverPort, () => {
      console.log(`Server listening at http://localhost:${serverPort}`)
    })
  }
}
