/* eslint-env mocha */

const chai = require('chai')
const path = require('path')
const fs = require('fs-extra')
const os = require('os')
const createNewProject = require('../../src/utils/create-new-project')

const expect = chai.expect
const temp = os.tmpdir()

const defaultOptions = {
  skipGit: true,
  skipInstall: true,
  quiet: true
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
  })

  it('should create a provider project from the template', async () => {
    await createNewProject(temp, 'provider', appName, defaultOptions)
    expect(await fs.pathExists(appPath)).to.equal(true)

    const packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
    expect(packageInfo.name).to.equal(appName)

    const koopConfig = await fs.readJson(path.join(appPath, 'koop.json'))
    expect(koopConfig.type).to.equal('provider')
  })

  it('should add a server file to the new provider project if specified', async () => {
    await createNewProject(
      temp,
      'provider',
      appName,
      {
        ...defaultOptions,
        addServer: true
      }
    )

    expect(await fs.pathExists(appPath)).to.equal(true)
    expect(await fs.pathExists(path.join(appPath, 'src/server.js'))).to.equal(true)

    const packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
    expect(packageInfo.name).to.equal(appName)
    expect(packageInfo.scripts.start).to.equal('node src/server.js')
    expect(packageInfo.dependencies.koop).to.be.a('string')

    const koopConfig = await fs.readJson(path.join(appPath, 'koop.json'))
    expect(koopConfig.type).to.equal('provider')
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
})
