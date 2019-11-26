/* eslint-env mocha */

const os = require('os')
const path = require('path')
const chai = require('chai')
const fs = require('fs-extra')
const proxyquire = require('proxyquire')
const createNewProject = require('../../src/utils/create-new-project')

const modulePath = '../../src/utils/add-plugin'
const addNpmPluginModulePath = path.join(modulePath, 'add-npm-plugin')

const expect = chai.expect
const temp = os.tmpdir()

const defaultOptions = {
  skipGit: true,
  skipInstall: true,
  quiet: true
}

let appName, appPath

describe('utils/add-plugin', function () {
  this.timeout(5000)

  beforeEach(async () => {
    appName = `add-command-test-${Date.now()}`
    appPath = path.join(temp, appName)
    await createNewProject(temp, 'app', appName, defaultOptions)
  })

  it('should add plugin config if provided', async () => {
    const addNpmPlugin = proxyquire(addNpmPluginModulePath, {
      'latest-version': async () => '3.2.1'
    })
    const addPlugin = proxyquire(modulePath, {
      './add-npm-plugin': addNpmPlugin
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

  it('should add the output plugin to the output list in the project', async () => {
    const addNpmPlugin = proxyquire(addNpmPluginModulePath, {
      'latest-version': async () => '3.2.1'
    })
    const addPlugin = proxyquire(modulePath, {
      './add-npm-plugin': addNpmPlugin
    })
    await addPlugin(appPath, 'output', '@koop/output-tile', defaultOptions)

    const plugins = await fs.readFile(path.join(appPath, 'src', 'plugins.js'), 'utf-8')
    const expected = [
      "const outputTile = require('@koop/output-tile');",
      'const outputs = [{',
      '  instance: outputTile',
      '}];',
      'const auths = [];',
      'const caches = [];',
      'const plugins = [];',
      'module.exports = [...outputs, ...auths, ...caches, ...plugins];'
    ].join(os.EOL)
    expect(plugins).to.equal(expected)
  })

  it('should add the auth plugin to the auth list in the project', async () => {
    const addNpmPlugin = proxyquire(addNpmPluginModulePath, {
      'latest-version': async () => '3.2.1'
    })
    const addPlugin = proxyquire(modulePath, {
      './add-npm-plugin': addNpmPlugin
    })
    await addPlugin(appPath, 'auth', '@koop/my-auth', defaultOptions)

    const plugins = await fs.readFile(path.join(appPath, 'src', 'plugins.js'), 'utf-8')
    const expected = [
      "const myAuth = require('@koop/my-auth');",
      'const outputs = [];',
      'const auths = [{',
      '  instance: myAuth',
      '}];',
      'const caches = [];',
      'const plugins = [];',
      'module.exports = [...outputs, ...auths, ...caches, ...plugins];'
    ].join(os.EOL)
    expect(plugins).to.equal(expected)
  })

  it('should add the cache plugin to the cache list in the project', async () => {
    const addNpmPlugin = proxyquire(addNpmPluginModulePath, {
      'latest-version': async () => '3.2.1'
    })
    const addPlugin = proxyquire(modulePath, {
      './add-npm-plugin': addNpmPlugin
    })
    await addPlugin(appPath, 'cache', '@koop/my-cache', defaultOptions)

    const plugins = await fs.readFile(path.join(appPath, 'src', 'plugins.js'), 'utf-8')
    const expected = [
      "const myCache = require('@koop/my-cache');",
      'const outputs = [];',
      'const auths = [];',
      'const caches = [{',
      '  instance: myCache',
      '}];',
      'const plugins = [];',
      'module.exports = [...outputs, ...auths, ...caches, ...plugins];'
    ].join(os.EOL)
    expect(plugins).to.equal(expected)
  })

  it('should add the plugin options to the plugin list', async () => {
    const addNpmPlugin = proxyquire(addNpmPluginModulePath, {
      'latest-version': async () => '3.2.1'
    })
    const addPlugin = proxyquire(modulePath, {
      './add-npm-plugin': addNpmPlugin
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
      'const auths = [];',
      'const caches = [];',
      'const plugins = [{',
      '  instance: testProvider,',
      '  options: {',
      "    routePrefix: '/my-route/'",
      '  }',
      '}];',
      'module.exports = [...outputs, ...auths, ...caches, ...plugins];'
    ].join(os.EOL)
    expect(plugins).to.equal(expected)
  })
})
