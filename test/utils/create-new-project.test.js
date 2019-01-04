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

  beforeEach(() => {
    shell.cd(temp)
  })

  it('should create an app project from the template', async () => {
    const appName = 'new-test-1'
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

    shell.rm('-rf', appPath)
  })

  it('should create a provider project from the template', async () => {
    const appName = 'new-test-2'
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

    shell.rm('-rf', appPath)
  })
})
