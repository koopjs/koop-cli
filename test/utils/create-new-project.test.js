/* eslint-env mocha */

const chai = require('chai')
const shell = require('shelljs')
const path = require('path')
const fs = require('fs-extra')
const createNewProject = require('../../src/utils/create-new-project')

const expect = chai.expect
const temp = path.join(__dirname, 'temp')

describe('new command', () => {
  before(() => {
    shell.mkdir('-p', temp)
  })

  after(() => {
    shell.rm('-rf', temp)
  })

  beforeEach(() => {
    shell.cd(temp)
  })

  it('should create an app project from the template', async () => {
    const appName = `new-test-${Date.now()}`
    const appPath = path.join(temp, appName)

    await createNewProject(
      temp,
      'app',
      appName,
      {
        skipGit: true,
        skipInstall: true
      }
    )
    expect(shell.test('-e', appPath)).to.equal(true)

    const packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
    expect(packageInfo.name).to.equal(appName)

    const koopConfig = await fs.readJson(path.join(appPath, 'koop.json'))
    expect(koopConfig.type).to.equal('app')
  })

  it('should create a provider project from the template', async () => {
    const appName = `new-test-${Date.now()}`
    const appPath = path.join(temp, appName)

    await createNewProject(
      temp,
      'provider',
      appName,
      {
        skipGit: true,
        skipInstall: true
      }
    )
    expect(shell.test('-e', appPath)).to.equal(true)

    const packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
    expect(packageInfo.name).to.equal(appName)

    const koopConfig = await fs.readJson(path.join(appPath, 'koop.json'))
    expect(koopConfig.type).to.equal('provider')
  })

  it('should add a server file to the new provider project if specified', async () => {
    const appName = `new-test-${Date.now()}`
    const appPath = path.join(temp, appName)

    await createNewProject(
      temp,
      'provider',
      appName,
      {
        skipGit: true,
        skipInstall: true,
        addServer: true
      }
    )

    expect(shell.test('-e', appPath)).to.equal(true)
    expect(shell.test('-e', path.join(appPath, 'src/server.js'))).to.equal(true)

    const packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
    expect(packageInfo.name).to.equal(appName)
    expect(packageInfo.scripts.start).to.equal('node src/server.js')

    const koopConfig = await fs.readJson(path.join(appPath, 'koop.json'))
    expect(koopConfig.type).to.equal('provider')
  })
})
