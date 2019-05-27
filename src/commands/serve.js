const path = require('path')
const fs = require('fs-extra')
const exec = require('../utils/exec-realtime')

const createServer = {
  provider: serveProvider,
  app: serveApp
}

function builder (yargs) {
  yargs
    .option('port', {
      alias: 'p',
      type: 'number',
      description: 'port number of the server'
    })
}

async function handler (argv = {}) {
  const configPath = path.join(process.cwd(), 'koop.json')
  const koopConfig = await fs.readJson(configPath)

  await createServer[koopConfig.type](argv.port)
}

async function serveApp () {
  const packageInfo = await fs.readJson(path.join(process.cwd(), 'package.json'))
  exec(`node ${packageInfo.main}`)
}

async function serveProvider (port) {
  const packageInfo = await fs.readJson(path.join(process.cwd(), 'package.json'))
  const Koop = require('koop')
  const koop = new Koop()

  const provider = require(path.join(process.cwd(), packageInfo.main))
  koop.register(provider)
  const serverPort = port || 8080
  koop.server.listen(serverPort, () => {
    console.log(`Server listening at http://localhost:${serverPort}`)
  })
}

module.exports = {
  command: 'serve',
  description: 'run a koop server for the current project',
  builder,
  handler
}
