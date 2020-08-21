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
    const initializerPath = ['.', 'output-tile', 'initialize'].join(path.sep)
    const expected = [
      `const outputTile = require('${initializerPath}')();`,
      'const outputs = [outputTile];',
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
    const initializerPath = ['.', 'my-auth', 'initialize'].join(path.sep)
    const expected = [
      `const myAuth = require('${initializerPath}')();`,
      'const outputs = [];',
      'const auths = [myAuth];',
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
    const initializerPath = ['.', 'my-cache', 'initialize'].join(path.sep)
    const expected = [
      `const myCache = require('${initializerPath}')();`,
      'const outputs = [];',
      'const auths = [];',
      'const caches = [myCache];',
      'const plugins = [];',
      'module.exports = [...outputs, ...auths, ...caches, ...plugins];'
    ].join(os.EOL)
    expect(plugins).to.equal(expected)
  })

  it('should create the plugin initializer', async () => {
    const addNpmPlugin = proxyquire(addNpmPluginModulePath, {
      'latest-version': async () => '3.2.1'
    })
    const addPlugin = proxyquire(modulePath, {
      './add-npm-plugin': addNpmPlugin
    })
    await addPlugin(appPath, 'cache', '@koop/my-cache', defaultOptions)

    const plugins = await fs.readFile(path.join(appPath, 'src', 'my-cache', 'initialize.js'), 'utf-8')
    const expected = [
      "const myCache = require('@koop/my-cache');",
      'function initialize() {',
      '  return {',
      '    instance: myCache',
      '  };',
      '}',
      'module.exports = initialize;'
    ].join(os.EOL)
    expect(plugins).to.equal(expected)
  })

  it('should create the plugin initializer with options', async () => {
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

    const plugins = await fs.readFile(path.join(appPath, 'src', 'test-provider', 'initialize.js'), 'utf-8')
    const expected = [
      "const testProvider = require('test-provider');",
      'function initialize() {',
      '  return {',
      '    instance: testProvider,',
      '    options: {',
      "      routePrefix: '/my-route/'",
      '    }',
      '  };',
      '}',
      'module.exports = initialize;'
    ].join(os.EOL)
    expect(plugins).to.equal(expected)
  })
})
