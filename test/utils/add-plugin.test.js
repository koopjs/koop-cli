/* eslint-env mocha */

const chai = require('chai')
const shell = require('shelljs')
const path = require('path')
const fs = require('fs-extra')
const os = require('os')
const createNewProject = require('../../src/utils/create-new-project')
const addPlugin = require('../../src/utils/add-plugin')

const expect = chai.expect
const temp = os.tmpdir()

const defaultOptions = {
  skipGit: true,
  skipInstall: true,
  quiet: true
}

let appName, appPath

describe('utils/add-plugin', () => {
  beforeEach(() => {
    shell.cd(temp)
    appName = `add-command-test-${Date.now()}`
    appPath = path.join(temp, appName)
  })

  it('should add a plugin to an app project', async () => {
    await createNewProject(temp, 'app', appName, defaultOptions)
    shell.cd(appPath)

    await addPlugin(appPath, 'test-provider', defaultOptions)

    const plugins = await fs.readFile(path.join(appPath, 'src', 'plugins.js'), 'utf-8')
    const expected = [
      "const testProvider = require('test-provider')",
      'module.exports = [',
      '  testProvider,',
      ']'
    ].join(os.EOL)
    expect(plugins).to.includes(expected)
  })

  it('should add a plugin published as a scoped module', async () => {
    const appPath = path.join(temp, appName)

    await createNewProject(temp, 'app', appName, defaultOptions)
    shell.cd(appPath)

    await addPlugin(appPath, '@koop/test-provider', defaultOptions)

    const plugins = await fs.readFile(path.join(appPath, 'src', 'plugins.js'), 'utf-8')
    const expected = [
      "const testProvider = require('@koop/test-provider')",
      'module.exports = [',
      '  testProvider,',
      ']'
    ].join(os.EOL)
    expect(plugins).to.includes(expected)
  })

  it('should add a plugin published with a version number', async () => {
    const appPath = path.join(temp, appName)

    await createNewProject(temp, 'app', appName, defaultOptions)
    shell.cd(appPath)

    await addPlugin(appPath, '@koop/test-provider@^3.2.0', defaultOptions)

    const plugins = await fs.readFile(path.join(appPath, 'src', 'plugins.js'), 'utf-8')
    const expected = [
      "const testProvider = require('@koop/test-provider')",
      'module.exports = [',
      '  testProvider,',
      ']'
    ].join(os.EOL)
    expect(plugins).to.includes(expected)
  })

  it('should add plugin config if provided', async () => {
    const appPath = path.join(temp, appName)

    await createNewProject(temp, 'app', appName, defaultOptions)
    shell.cd(appPath)

    await addPlugin(
      appPath,
      'test-provider',
      {
        config: { api: 'api url' },
        ...defaultOptions
      }
    )

    const appConfig = await fs.readJson(path.join(appPath, 'config', 'default.json'))
    expect(appConfig['test-provider']).to.deep.equal({
      api: 'api url'
    })
  })

  it('should append the plugin config to the app config if specified', async () => {
    const appPath = path.join(temp, appName)

    await createNewProject(temp, 'app', appName, defaultOptions)
    shell.cd(appPath)

    await addPlugin(
      appPath,
      'test-provider',
      {
        config: { api: 'api url' },
        addToRoot: true,
        ...defaultOptions
      }
    )

    const appConfig = await fs.readJson(path.join(appPath, 'config', 'default.json'))
    expect(appConfig.api).to.equal('api url')
  })
})
