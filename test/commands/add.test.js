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

let appName

describe('add command', () => {
  before(() => {
    shell.mkdir('-p', temp)
  })

  beforeEach(() => {
    shell.cd(temp)
    appName = `add-command-test-${Date.now()}`
  })

  it('should add a plugin to an app project', async () => {
    const app = path.join(temp, appName)

    await newCommand.handler({
      name: appName,
      type: 'app',
      skipInstall: true,
      skipGit: true
    })
    shell.cd(app)

    await addCommand.handler({ name: 'test-provider', skipInstall: true })

    const plugins = await fs.readFile(path.join(app, 'src', 'plugins.js'), 'utf-8')
    const expected = [
      "const testProvider = require('test-provider')",
      'module.exports = [',
      '  testProvider,',
      ']'
    ].join(os.EOL)
    expect(plugins).to.includes(expected)

    shell.rm('-rf', app)
  })

  it('should add a plugin published as a scoped module', async () => {
    const app = path.join(temp, appName)

    await newCommand.handler({
      name: appName,
      type: 'app',
      skipInstall: true,
      skipGit: true
    })
    shell.cd(app)

    await addCommand.handler({ name: '@koop/test-provider', skipInstall: true })

    const plugins = await fs.readFile(path.join(app, 'src', 'plugins.js'), 'utf-8')
    const expected = [
      "const testProvider = require('@koop/test-provider')",
      'module.exports = [',
      '  testProvider,',
      ']'
    ].join(os.EOL)
    expect(plugins).to.includes(expected)

    shell.rm('-rf', app)
  })

  it('should add plugin config if provided', async () => {
    const app = path.join(temp, appName)

    await newCommand.handler({
      name: appName,
      type: 'app',
      skipInstall: true,
      skipGit: true
    })
    shell.cd(app)

    await addCommand.handler({
      name: 'test-provider',
      config: {
        api: 'api url'
      },
      skipInstall: true
    })

    const appConfig = await fs.readJson(path.join(app, 'config', 'default.json'))
    expect(appConfig['test-provider']).to.deep.equal({
      api: 'api url'
    })

    shell.rm('-rf', app)
  })

  it('should add string plugin config if provided', async () => {
    const app = path.join(temp, appName)

    await newCommand.handler({
      name: appName,
      type: 'app',
      skipInstall: true,
      skipGit: true
    })
    shell.cd(app)

    await addCommand.handler({
      name: 'test-provider',
      config: JSON.stringify({
        api: 'api url'
      }),
      skipInstall: true
    })

    const appConfig = await fs.readJson(path.join(app, 'config', 'default.json'))
    expect(appConfig['test-provider']).to.deep.equal({
      api: 'api url'
    })

    shell.rm('-rf', app)
  })

  it('should append the plugin config to the app config if specified', async () => {
    const app = path.join(temp, appName)

    await newCommand.handler({
      name: appName,
      type: 'app',
      skipInstall: true,
      skipGit: true
    })
    shell.cd(app)

    await addCommand.handler({
      name: 'test-provider',
      config: {
        api: 'api url'
      },
      appendToRoot: true,
      skipInstall: true
    })

    const appConfig = await fs.readJson(path.join(app, 'config', 'default.json'))
    expect(appConfig.api).to.equal('api url')

    shell.rm('-rf', app)
  })
})
