const path = require('path')
const fs = require('fs-extra')
const execa = require('execa')
const nodemon = require('nodemon')
const os = require('os')
const dargs = require('dargs')
const getPathArg = require('./get-path-arg')
const Logger = require('../logger')

module.exports = async (cwd, options = {}) => {
  const koopConfig = await fs.readJson(path.join(cwd, 'koop.json'))
  // for test mocking
  const dirname = options.dirname || __dirname
  const nodeArgs = {
    _: []
  }
  const serveArgs = {}
  const logger = options.logger || new Logger(options)

  if (options.debug) {
    nodeArgs.inspect = true
  }

  if (options.path) {
    // run the test server file if provided
    const filePath = getPathArg(options.path, options.watch)
    nodeArgs._.push(filePath)
  } else if (koopConfig.type === 'app') {
    // if it is an app, run it directly
    const packageInfo = await fs.readJson(path.join(cwd, 'package.json'))
    const appPath = getPathArg(packageInfo.main, options.watch)
    nodeArgs._.push(appPath)

    if (options.sslCert || options.sslKey) {
      logger.warn('WARN: The HTTPS feature does not work on an app project. The --ssl-cert and --ssl-key values will be ignored.')
    }
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

    const serverPath = getPathArg(path.join(dirname, 'serve-plugin.js'), options.watch)
    const cwdPath = getPathArg(cwd, options.watch)
    nodeArgs._.push(serverPath)
    serveArgs.cwd = cwdPath

    if (options.data) {
      const dataPath = getPathArg(options.data, options.watch)
      serveArgs.dataPath = dataPath
    }

    if (options.port) {
      serveArgs.port = options.port
    }

    // provide the SSH certification and key files are provided
    if (options.sslCert && options.sslKey) {
      serveArgs.sslCertPath = getPathArg(options.sslCert, options.watch)
      serveArgs.sslKeyPath = getPathArg(options.sslKey, options.watch)
    }
  }

  const args = [
    ...dargs(nodeArgs),
    ...dargs(serveArgs)
  ]

  if (options.watch) {
    startsWithNodemon(cwd, args)
  } else {
    startsWithNode(cwd, args)
  }
}

function startsWithNode (cwd, args) {
  execa('node', args, {
    cwd,
    stdio: 'inherit'
  })
}

function startsWithNodemon (cwd, args) {
  nodemon({
    exec: `node ${args.join(' ')}`,
    watch: cwd,
    ignore: ['node_modules', '.git']
  })
    .on('restart', function (files) {
      console.log(os.EOL)
      console.log('App restarted due to: ', files)
      console.log(os.EOL)
    })
}
