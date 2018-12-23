/* eslint-env mocha */

const chai = require('chai')
const shell = require('shelljs')
const path = require('path')
const fs = require('fs-extra')
const { handler } = require('../../src/commands/new')

const expect = chai.expect
const temp = path.join(__dirname, 'temp')
const app = path.join(temp, 'test')

describe('new command', () => {
  before(() => {
    shell.mkdir('-p', temp)
  })

  beforeEach(() => {
    shell.cd(temp)
  })

  afterEach(() => {
    if (shell.test('-e', app)) {
      shell.rm('-rf', app)
    }
  })

  after(() => {
    shell.rm('-rf', temp)
  })

  it('should create an app project from the template', async () => {
    handler({ name: 'test', type: 'app', skipInstall: true })
    expect(shell.test('-e', app)).to.equal(true)

    const packageInfo = await fs.readJson(path.join(app, 'package.json'))
    expect(packageInfo.name).to.equal('test')

    const koopConfig = await fs.readJson(path.join(app, 'koop.json'))
    expect(koopConfig.type).to.equal('app')
  })

  it('should create a provider project from the template', async () => {
    handler({ name: 'test', type: 'provider', skipInstall: true })
    expect(shell.test('-e', app)).to.equal(true)

    const packageInfo = await fs.readJson(path.join(app, 'package.json'))
    expect(packageInfo.name).to.equal('test')

    const koopConfig = await fs.readJson(path.join(app, 'koop.json'))
    expect(koopConfig.type).to.equal('provider')
  })
})
