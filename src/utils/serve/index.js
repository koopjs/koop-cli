const path = require('path')
const fs = require('fs-extra')
const exec = require('../exec-realtime')

module.exports = async (cwd, options = {}) => {
  const koopConfig = await fs.readJson(path.join(cwd, 'koop.json'))
  const parameters = []
  let serverPath = ''

  if (options.path) {
    // run the test server file if provided
    serverPath = path.join(cwd, options.path)
  } else if (koopConfig.type === 'app') {
    // if it is an app, run it directly
    const packageInfo = await fs.readJson(path.join(cwd, 'package.json'))
    serverPath = path.join(cwd, packageInfo.main)
  } else {
    // otherwise, this is a plugin and we should run a Koop server for it

    // if the plugin isn't a provider, the user should provide a test data file
    // for the dev-provider
    if (
      koopConfig.type !== 'provider' && (
        !options.data ||
        !options.data.endsWith('.geojson') ||
        !(await fs.pathExists(path.join(cwd, options.data)))
      )
    ) {
      throw new Error('A GeoJSON file is requried to provide test data for the dev server.')
    }

    serverPath = './serve-plugin'

    parameters.push(`--cwd=${cwd}`)

    if (options.data) {
      parameters.push(`--data-path=${options.data}`)
    }

    if (options.port) {
      parameters.push(`--port=${options.port}`)
    }
  }

  if (options.debug) {
    parameters.push('--inspect-brk')
  }

  exec(`node ${serverPath} ${parameters.join(' ')}`.trim())
}
