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

  it('should create an auth plugin project from the template', async () => {
    await createNewProject(temp, 'auth', appName, defaultOptions)
    expect(await fs.pathExists(appPath)).to.equal(true)

    const packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
    expect(packageInfo.name).to.equal(appName)

    const koopConfig = await fs.readJson(path.join(appPath, 'koop.json'))
    expect(koopConfig.type).to.equal('auth')
  })
})
