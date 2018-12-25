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

describe('add command', () => {
  before(() => {
    shell.mkdir('-p', temp)
  })

  beforeEach(() => {
    shell.cd(temp)
  })

  it('should add a provider to an app project', async () => {
    const appName = 'add-test-1'
    const app = path.join(temp, appName)

    newCommand.handler({
      name: appName,
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

    if (shell.test('-e', app)) {
      shell.rm('-rf', app)
    }
  })
})
