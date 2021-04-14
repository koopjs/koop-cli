/* eslint-env mocha */

const os = require('os')
const path = require('path')
const chai = require('chai')
const fs = require('fs-extra')
const proxyquire = require('proxyquire')
const removePlugin = require('../../src/utils/remove-plugin')
const createNewProject = require('../../src/utils/create-new-project')
const Logger = require('../../src/utils/logger')

const modulePath = '../../src/utils/add-plugin'
const addNpmPluginModulePath = path.join(modulePath, 'add-npm-plugin')

const expect = chai.expect
const temp = os.tmpdir()

const defaultOptions = {
  skipGit: true,
  skipInstall: true,
  quiet: true,
  config: {
    test: 'value'
  },
  logger: new Logger({ quiet: true })
}

let appName, appPath

describe('utils/remove-plugin', function () {
  this.timeout(5000)

  beforeEach(async () => {
    appName = `remove-command-test-${Date.now()}`
    appPath = path.join(temp, appName)
    await createNewProject(temp, 'app', appName, defaultOptions)
  })

  it('should remove a plugin from npm', async () => {
    const addNpmPlugin = proxyquire(addNpmPluginModulePath, {
      'latest-version': async () => '3.2.1'
    })
    const addPlugin = proxyquire(modulePath, {
      './add-npm-plugin': addNpmPlugin
    })

    // add a plugin and verify that all things are updated

    await addPlugin(appPath, 'provider', '@koop/provider-test', defaultOptions)

    const srcPath = path.join(appPath, 'src')
    expect(await fs.pathExists(path.join(srcPath, 'provider-test'))).to.equal(true)

    let plugins = await fs.readFile(path.join(srcPath, 'plugins.js'), 'utf-8')
    expect(plugins.includes('provider-test')).to.equal(true)

    let koopConfig = await fs.readJson(path.join(appPath, 'koop.json'))
    expect(koopConfig.plugins).to.have.lengthOf(1)

    let pluginConfig = await fs.readJson(path.join(appPath, 'config/default.json'))
    expect(pluginConfig['@koop/provider-test']).to.be.an('object')

    let packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
    expect(packageInfo.dependencies['@koop/provider-test']).to.be.a('string')

    // remove the dependency and verify that all things are removed

    await removePlugin(appPath, '@koop/provider-test', defaultOptions)

    expect(await fs.pathExists(path.join(srcPath, 'provider-test'))).to.equal(false)

    plugins = await fs.readFile(path.join(srcPath, 'plugins.js'), 'utf-8')
    expect(plugins.includes('provider-test')).to.equal(false)

    koopConfig = await fs.readJson(path.join(appPath, 'koop.json'))
    expect(koopConfig.plugins).to.have.lengthOf(0)

    pluginConfig = await fs.readJson(path.join(appPath, 'config/default.json'))
    expect(pluginConfig['@koop/provider-test']).to.equal(undefined)

    packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
    expect(packageInfo.dependencies['@koop/provider-test']).equal(undefined)
  })

  it('should remove a plugin from local', async () => {
    const options = Object.assign({}, defaultOptions, { local: true })

    // add a plugin and verify that all things are updated

    const addPlugin = require(modulePath)
    await addPlugin(appPath, 'provider', 'plugins/provider-test', options)

    const srcPath = path.join(appPath, 'src')

    expect(await fs.pathExists(path.join(srcPath, 'plugins/provider-test'))).to.equal(true)

    let plugins = await fs.readFile(path.join(srcPath, 'plugins.js'), 'utf-8')
    expect(plugins.includes('provider-test')).to.equal(true)

    let koopConfig = await fs.readJson(path.join(appPath, 'koop.json'))
    expect(koopConfig.plugins).to.have.lengthOf(1)

    let pluginConfig = await fs.readJson(path.join(appPath, 'config/default.json'))
    expect(pluginConfig['provider-test']).to.be.an('object')

    // remove the dependency and verify that all things are removed

    await removePlugin(appPath, 'provider-test', defaultOptions)

    expect(await fs.pathExists(path.join(srcPath, 'plugins/provider-test'))).to.equal(false)

    plugins = await fs.readFile(path.join(srcPath, 'plugins.js'), 'utf-8')
    expect(plugins.includes('provider-test')).to.equal(false)

    koopConfig = await fs.readJson(path.join(appPath, 'koop.json'))
    expect(koopConfig.plugins).to.have.lengthOf(0)

    pluginConfig = await fs.readJson(path.join(appPath, 'config/default.json'))
    expect(pluginConfig['provider-test']).to.equal(undefined)
  })
})
