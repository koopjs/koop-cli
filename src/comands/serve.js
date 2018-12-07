const path = require('path')
const shell = require('shelljs')
const Koop = require('koop')

exports.options = (yargs) => {
}

exports.handler = (argv) =>
  const koopConfig = require(path.join(process.cwd(), 'koop.json'))

  if (koopConfig.type === 'provider') {

  } else if (koopConfig.type === 'app') {
    serveApp()
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

function serveProvider () {
  const packageInfo = require(path.join(process.cwd(), 'package.json'))
  const koop = new Koop()

  const provider = require(packageInfo.main)
  koop.register(provider)
  koop.server.listen(8080)
}
