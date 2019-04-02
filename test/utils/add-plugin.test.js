/* eslint-env mocha */

const os = require('os')
const path = require('path')
const chai = require('chai')
const fs = require('fs-extra')
const proxyquire = require('proxyquire')

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

  it('should add a plugin to an app project', async () => {
    const addNpmPlugin = proxyquire(addNpmPluginModulePath, {
      'latest-version': async () => '1.0.0'
    })
    const addPlugin = proxyquire(modulePath, {
      './add-npm-plugin': addNpmPlugin
    })
    await addPlugin(appPath, 'provider', 'test-provider', defaultOptions)

    const plugins = await fs.readFile(path.join(appPath, 'src', 'plugins.js'), 'utf-8')
    const expected = [
      "const testProvider = require('test-provider');",
      'const outputs = [];',
      'const auths = [];',
      'const plugins = [{',
      '  instance: testProvider',
      '}];',
      'module.exports = [...outputs, ...auths, ...plugins];'
    ].join(os.EOL)
    expect(plugins).to.equal(expected)

    const packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
    expect(packageInfo.dependencies['test-provider']).to.equal('^1.0.0')
  })

  it('should add a plugin published as a scoped module', async () => {
    const addNpmPlugin = proxyquire(addNpmPluginModulePath, {
      'latest-version': async () => '1.0.0'
    })
    const addPlugin = proxyquire(modulePath, {
      './add-npm-plugin': addNpmPlugin
    })

    await addPlugin(appPath, 'provider', '@koop/test-provider', defaultOptions)

    const plugins = await fs.readFile(path.join(appPath, 'src', 'plugins.js'), 'utf-8')
    const expected = [
      "const testProvider = require('@koop/test-provider');",
      'const outputs = [];',
      'const auths = [];',
      'const plugins = [{',
      '  instance: testProvider',
      '}];',
      'module.exports = [...outputs, ...auths, ...plugins];'
    ].join(os.EOL)
    expect(plugins).to.equal(expected)

    const packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
    expect(packageInfo.dependencies['@koop/test-provider']).to.equal('^1.0.0')
  })

  it('should add a plugin published with a version number', async () => {
    const addNpmPlugin = proxyquire(addNpmPluginModulePath, {
      'latest-version': async () => '3.2.1'
    })
    const addPlugin = proxyquire(modulePath, {
      './add-npm-plugin': addNpmPlugin
    })
    await addPlugin(appPath, 'provider', '@koop/test-provider@3.2.0', defaultOptions)

    const plugins = await fs.readFile(path.join(appPath, 'src', 'plugins.js'), 'utf-8')
    const expected = [
      "const testProvider = require('@koop/test-provider');",
      'const outputs = [];',
      'const auths = [];',
      'const plugins = [{',
      '  instance: testProvider',
      '}];',
      'module.exports = [...outputs, ...auths, ...plugins];'
    ].join(os.EOL)
    expect(plugins).to.equal(expected)

    const packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
    expect(packageInfo.dependencies['@koop/test-provider']).to.equal('^3.2.1')
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

  it('should append the plugin config to the app config if specified', async () => {
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
        addToRoot: true,
        ...defaultOptions
      }
    )

    const appConfig = await fs.readJson(path.join(appPath, 'config', 'default.json'))
    expect(appConfig.api).to.equal('api url')
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
      'const plugins = [];',
      'module.exports = [...outputs, ...auths, ...plugins];'
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
      'const plugins = [];',
      'module.exports = [...outputs, ...auths, ...plugins];'
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
      'const plugins = [{',
      '  instance: testProvider,',
      '  options: {',
      "    routePrefix: '/my-route/'",
      '  }',
      '}];',
      'module.exports = [...outputs, ...auths, ...plugins];'
    ].join(os.EOL)
    expect(plugins).to.equal(expected)
  })
})

async function createNewProject (cwd, type, name) {
  const templatePath = path.resolve(__dirname, '../../src/templates/app/project')
  const projectPath = path.join(cwd, name)

  // just copy the app template and no need to use the formal project creator
  // (skip some file I/O)
  await fs.ensureDir(projectPath)
  await fs.copy(templatePath, projectPath)
}
