/* eslint-env mocha */

const chai = require('chai')
const path = require('path')
const fs = require('fs-extra')
const os = require('os')
const createNewProject = require('../../../src/utils/create-new-project')
const Logger = require('../../../src/utils/logger')

const expect = chai.expect
const temp = os.tmpdir()

const defaultOptions = {
  skipGit: true,
  skipInstall: true,
  quiet: true,
  logger: new Logger({ quiet: true })
}

let appName, appPath

describe('utils/create-new-project', () => {
  beforeEach(() => {
    appName = `test-${Date.now()}`
    appPath = path.join(temp, appName)
  })

  it('should create an app project from the template', async () => {
    await createNewProject(temp, 'app', appName, defaultOptions)
    expect(await fs.pathExists(appPath)).to.equal(true)

    const packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
    expect(packageInfo.name).to.equal(appName)

    const koopConfig = await fs.readJson(path.join(appPath, 'koop.json'))
    expect(koopConfig.type).to.equal('app')
    expect(koopConfig.plugins).to.be.an('Array')

    expect(await fs.pathExists(path.join(appPath, 'src/index.js'))).to.equal(true)
    expect(await fs.pathExists(path.join(appPath, 'src/routes.js'))).to.equal(true)
    expect(await fs.pathExists(path.join(appPath, 'src/plugins.js'))).to.equal(true)
    expect(await fs.pathExists(path.join(appPath, 'src/request-handlers/welcome-page.js'))).to.equal(true)
  })

  it('should create a provider project from the template', async () => {
    await createNewProject(temp, 'provider', appName, defaultOptions)
    expect(await fs.pathExists(appPath)).to.equal(true)

    const packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
    expect(packageInfo.name).to.equal(appName)

    const koopConfig = await fs.readJson(path.join(appPath, 'koop.json'))
    expect(koopConfig.type).to.equal('provider')
    expect(koopConfig.name).to.be.a('string')
    expect(koopConfig.allowedParams).to.be.an('object')

    expect(await fs.pathExists(path.join(appPath, 'src/index.js'))).to.equal(true)
    expect(await fs.pathExists(path.join(appPath, 'src/model.js'))).to.equal(true)

    expect(await fs.pathExists(path.join(appPath, 'test/index.test.js'))).to.equal(true)
    expect(await fs.pathExists(path.join(appPath, 'test/model.test.js'))).to.equal(true)
  })

  it('should create an auth plugin project from the template', async () => {
    await createNewProject(temp, 'auth', appName, defaultOptions)
    expect(await fs.pathExists(appPath)).to.equal(true)

    const packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
    expect(packageInfo.name).to.equal(appName)

    const koopConfig = await fs.readJson(path.join(appPath, 'koop.json'))
    expect(koopConfig.type).to.equal('auth')

    expect(await fs.pathExists(path.join(appPath, 'src/index.js'))).to.equal(true)
    expect(await fs.pathExists(path.join(appPath, 'src/authenticate.js'))).to.equal(true)
    expect(await fs.pathExists(path.join(appPath, 'src/authorize.js'))).to.equal(true)
    expect(await fs.pathExists(path.join(appPath, 'src/authentication-specification.js'))).to.equal(true)

    expect(await fs.pathExists(path.join(appPath, 'test/index.test.js'))).to.equal(true)
    expect(await fs.pathExists(path.join(appPath, 'test/authenticate.test.js'))).to.equal(true)
    expect(await fs.pathExists(path.join(appPath, 'test/authentication-specification.test.js'))).to.equal(true)
    expect(await fs.pathExists(path.join(appPath, 'test/data.geojson'))).to.equal(true)
  })

  it('should create an output plugin project from the template', async () => {
    await createNewProject(temp, 'output', appName, defaultOptions)
    expect(await fs.pathExists(appPath)).to.equal(true)

    const packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
    expect(packageInfo.name).to.equal(appName)

    const koopConfig = await fs.readJson(path.join(appPath, 'koop.json'))
    expect(koopConfig.type).to.equal('output')

    expect(await fs.pathExists(path.join(appPath, 'src/index.js'))).to.equal(true)
    expect(await fs.pathExists(path.join(appPath, 'src/routes.js'))).to.equal(true)
    expect(await fs.pathExists(path.join(appPath, 'src/request-handlers/serve.js'))).to.equal(true)

    expect(await fs.pathExists(path.join(appPath, 'test/index.test.js'))).to.equal(true)
    expect(await fs.pathExists(path.join(appPath, 'test/routes.test.js'))).to.equal(true)
    expect(await fs.pathExists(path.join(appPath, 'test/request-handlers/serve.test.js'))).to.equal(true)
    expect(await fs.pathExists(path.join(appPath, 'test/data.geojson'))).to.equal(true)
  })

  it('should update the config file if the config is specified with a JSON', async () => {
    await createNewProject(
      temp,
      'app',
      appName,
      {
        ...defaultOptions,
        config: { port: 3000 }
      }
    )

    const configPath = path.join(appPath, 'config/default.json')
    expect(await fs.pathExists(configPath)).to.equal(true)

    const config = await fs.readJson(configPath)
    expect(config.port).to.equal(3000)
  })

  it('should set the npm client if specified', async () => {
    await createNewProject(
      temp,
      'app',
      appName,
      {
        ...defaultOptions,
        npmClient: 'yarn'
      }
    )

    const configPath = path.join(appPath, 'koop.json')
    const config = await fs.readJson(configPath)
    expect(config.npmClient).to.equal('yarn')
  })
})
