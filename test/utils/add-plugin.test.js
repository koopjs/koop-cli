/* eslint-env mocha */

const chai = require('chai')
const path = require('path')
const fs = require('fs-extra')
const os = require('os')
const proxyquire = require('proxyquire')
const createNewProject = require('../../src/utils/create-new-project')

const modulePath = '../../src/utils/add-plugin'
const expect = chai.expect
const temp = os.tmpdir()

const defaultOptions = {
  skipGit: true,
  skipInstall: true,
  quiet: true
}

let appName, appPath

describe('utils/add-plugin', () => {
  beforeEach(async () => {
    appName = `add-command-test-${Date.now()}`
    appPath = path.join(temp, appName)
    await createNewProject(temp, 'app', appName, defaultOptions)
  })

  it('should add a plugin to an app project', async () => {
    const addPlugin = proxyquire(modulePath, {
      'latest-version': async () => '1.0.0'
    })
    await addPlugin(appPath, 'provider', 'test-provider', defaultOptions)

    const plugins = await fs.readFile(path.join(appPath, 'src', 'plugins.js'), 'utf-8')
    const expected = [
      "const testProvider = require('test-provider');",
      'const outputs = [];',
      'const plugins = [{',
      '  instance: testProvider',
      '}];',
      'module.exports = [...outputs, ...plugins];'
    ].join(os.EOL)
    expect(plugins).to.equal(expected)

    const packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
    expect(packageInfo.dependencies['test-provider']).to.equal('^1.0.0')
  })

  it('should add a plugin published as a scoped module', async () => {
    const addPlugin = proxyquire(modulePath, {
      'latest-version': async () => '1.0.0'
    })
    await addPlugin(appPath, 'provider', '@koop/test-provider', defaultOptions)

    const plugins = await fs.readFile(path.join(appPath, 'src', 'plugins.js'), 'utf-8')
    const expected = [
      "const testProvider = require('@koop/test-provider');",
      'const outputs = [];',
      'const plugins = [{',
      '  instance: testProvider',
      '}];',
      'module.exports = [...outputs, ...plugins];'
    ].join(os.EOL)
    expect(plugins).to.equal(expected)

    const packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
    expect(packageInfo.dependencies['@koop/test-provider']).to.equal('^1.0.0')
  })

  it('should add a plugin published with a version number', async () => {
    const addPlugin = proxyquire(modulePath, {
      'latest-version': async () => '3.2.1'
    })
    await addPlugin(appPath, 'provider', '@koop/test-provider@3.2.0', defaultOptions)

    const plugins = await fs.readFile(path.join(appPath, 'src', 'plugins.js'), 'utf-8')
    const expected = [
      "const testProvider = require('@koop/test-provider');",
      'const outputs = [];',
      'const plugins = [{',
      '  instance: testProvider',
      '}];',
      'module.exports = [...outputs, ...plugins];'
    ].join(os.EOL)
    expect(plugins).to.equal(expected)

    const packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
    expect(packageInfo.dependencies['@koop/test-provider']).to.equal('^3.2.1')
  })

  it('should add plugin config if provided', async () => {
    const addPlugin = proxyquire(modulePath, {
      'latest-version': async () => '3.2.1'
    })
    await addPlugin(
      appPath,
      'provider',
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
    const addPlugin = proxyquire(modulePath, {
      'latest-version': async () => '3.2.1'
    })
    await addPlugin(
      appPath,
      'provider',
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

  it('should add the output plugin to the output list in the project', async () => {
    const addPlugin = proxyquire(modulePath, {
      'latest-version': async () => '3.2.1'
    })
    await addPlugin(appPath, 'output', '@koop/output-tile', defaultOptions)

    const plugins = await fs.readFile(path.join(appPath, 'src', 'plugins.js'), 'utf-8')
    const expected = [
      "const outputTile = require('@koop/output-tile');",

      'const outputs = [{',
      '  instance: outputTile',
      '}];',
      'const plugins = [];',
      'module.exports = [...outputs, ...plugins];'
    ].join(os.EOL)
    expect(plugins).to.equal(expected)
  })

  it('should add the plugin options to the plugin list', async () => {
    const addPlugin = proxyquire(modulePath, {
      'latest-version': async () => '3.2.1'
    })
    await addPlugin(
      appPath,
      'provider',
      'test-provider',
      {
        routePrefix: '/my-route/',
        addToRoot: true,
        ...defaultOptions
      }
    )

    const plugins = await fs.readFile(path.join(appPath, 'src', 'plugins.js'), 'utf-8')
    const expected = [
      "const testProvider = require('test-provider');",
      'const outputs = [];',
      'const plugins = [{',
      '  instance: testProvider,',
      '  options: {',
      "    routePrefix: '/my-route/'",
      '  }',
      '}];',
      'module.exports = [...outputs, ...plugins];'
    ].join(os.EOL)
    expect(plugins).to.equal(expected)
  })
})
