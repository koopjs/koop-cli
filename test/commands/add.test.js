/* eslint-env mocha */

const chai = require('chai')
const shell = require('shelljs')
const path = require('path')
const fs = require('fs-extra')
const newCommand = require('../../src/commands/new')
const addCommand = require('../../src/commands/add')

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

  it('should add a provider to an app project', async () => {
    newCommand.handler({ name: 'test', type: 'app', skipInstall: true })
    shell.cd(app)

    addCommand.handler({ name: 'test-provider', type: 'provider', skipInstall: true })

    const server = await fs.readFile(path.join(app, 'src', 'index.js'), 'utf-8')
    expect(server).to.includes("const testProvider = require('test-provider')")
    expect(server).to.includes('koop.register(testProvider)')
  })
})
