const path = require('path')
const shell = require('shelljs')
const Koop = require('koop')

exports.options = (yargs) => {
  yargs
    .option('port', {
      alias: 'p',
      type: 'number',
      description: 'port number of the server'
    })
}

exports.handler = (argv) =>
  const koopConfig = require(path.join(process.cwd(), 'koop.json'))

  if (koopConfig.type === 'provider') {
    serveProvider(argv.port)
  } else if (koopConfig.type === 'app') {
    serveApp(argv.port)
  }
}

function serveApp () {
  const packageInfo = require(path.join(process.cwd(), 'package.json'))

  if (packageInfo.scripts.start) {
    shell.exec('npm run start')
  } else {
    shell.exec(`node ${packageInfo.main}`)
  }
}

function serveProvider (port) {
  const packageInfo = require(path.join(process.cwd(), 'package.json'))

  if (packageInfo.scripts.start) {
    shell.exec('npm run start')
  } else {
    const koop = new Koop()

    const provider = require(packageInfo.main)
    koop.register(provider)
    koop.server.listen(port || 8080)
  }
}
