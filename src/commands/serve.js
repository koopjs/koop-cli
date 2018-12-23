const path = require('path')
const shell = require('shelljs')
const fs = require('fs-extra')
const Koop = require('koop')

exports.options = (yargs) => {
  yargs
    .option('port', {
      alias: 'p',
      type: 'number',
      description: 'port number of the server'
    })
}

exports.handler = (argv = {}) => {
  const koopConfig = fs.readJsonSync(path.join(process.cwd(), 'koop.json'))

  if (koopConfig.type === 'provider') {
    serveProvider(argv.port)
  } else if (koopConfig.type === 'app') {
    serveApp(argv.port)
  }
}

function serveApp () {
  const packageInfo = fs.readJsonSync(path.join(process.cwd(), 'package.json'))

  if (packageInfo.scripts.start) {
    shell.exec('npm run start')
  } else {
    shell.exec(`node ${packageInfo.main}`)
  }
}

function serveProvider (port) {
  const packageInfo = fs.readJsonSync(path.join(process.cwd(), 'package.json'))

  if (packageInfo.scripts.start) {
    shell.exec('npm run start')
  } else {
    const koop = new Koop()

    const provider = fs.readJsonSync(path.join(process.cwd(), packageInfo.main))
    koop.register(provider)
    koop.server.listen(port || 8080)
  }
}
