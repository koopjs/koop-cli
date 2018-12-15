const chai = require("chai");
const shell = require('shelljs');
const path = require('path')
const fs = require('fs-extra')
const { handler } = require('../../src/commands/new')

const expect = chai.expect;
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

  it('should create a app project from the template', () => {
    handler({ name: 'test', type: 'app', skipInstall: true })
    expect(shell.test('-e', app)).to.be.true

    const packageInfo = fs.readJsonSync(path.join(app, 'package.json'))
    expect(packageInfo.name).to.equal('test')

    const koopConfig = fs.readJsonSync(path.join(app, 'koop.json'))
    expect(koopConfig.type).to.equal('app')
  })

  it('should create a provider project from the template', () => {
    handler({ name: 'test', type: 'provider', skipInstall: true })
    expect(shell.test('-e', app)).to.be.true

    const packageInfo = fs.readJsonSync(path.join(app, 'package.json'))
    expect(packageInfo.name).to.equal('test')

    const koopConfig = fs.readJsonSync(path.join(app, 'koop.json'))
    expect(koopConfig.type).to.equal('provider')
  })
})
