/* eslint-env mocha */

const chai = require('chai')
const shell = require('shelljs')
const path = require('path')
const fs = require('fs-extra')
const newCommand = require('../../src/commands/new')
const addCommand = require('../../src/commands/add')
const os = require('os')

const expect = chai.expect
const temp = path.join(__dirname, 'temp')
const app = path.join(temp, 'test')

describe('add command', () => {
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
    newCommand.handler({
      name: 'test',
      type: 'app',
      skipInstall: true,
      skipGit: true
    })
    shell.cd(app)

    addCommand.handler({ name: 'test-provider', skipInstall: true })

    const plugins = await fs.readFile(path.join(app, 'src', 'plugins.js'), 'utf-8')
    const expected = [
      "const testProvider = require('test-provider')",
      'module.exports = [',
      '  testProvider,',
      ']'
    ].join(os.EOL)
    expect(plugins).to.includes(expected)
  })
})
