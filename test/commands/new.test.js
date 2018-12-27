/* eslint-env mocha */

const chai = require('chai')
const shell = require('shelljs')
const path = require('path')
const fs = require('fs-extra')
const { handler } = require('../../src/commands/new')

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
    const app = path.join(temp, appName)

    await handler({
      name: appName,
      type: 'app',
      skipGit: true,
      skipInstall: true
    })
    expect(shell.test('-e', app)).to.equal(true)

    const packageInfo = await fs.readJson(path.join(app, 'package.json'))
    expect(packageInfo.name).to.equal(appName)

    const koopConfig = await fs.readJson(path.join(app, 'koop.json'))
    expect(koopConfig.type).to.equal('app')

    shell.rm('-rf', app)
  })

  it('should create a provider project from the template', async () => {
    const appName = 'new-test-2'
    const app = path.join(temp, appName)

    await handler({
      name: appName,
      type: 'provider',
      skipGit: true,
      skipInstall: true
    })
    expect(shell.test('-e', app)).to.equal(true)

    const packageInfo = await fs.readJson(path.join(app, 'package.json'))
    expect(packageInfo.name).to.equal(appName)

    const koopConfig = await fs.readJson(path.join(app, 'koop.json'))
    expect(koopConfig.type).to.equal('provider')

    shell.rm('-rf', app)
  })
})
