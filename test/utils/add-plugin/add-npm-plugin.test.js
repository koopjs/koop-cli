/* eslint-env mocha */

const os = require('os')
const path = require('path')
const chai = require('chai')
const fs = require('fs-extra')
const proxyquire = require('proxyquire')
const createNewProject = require('../../test-helpers/create-new-project')

const modulePath = '../../../src/utils/add-plugin'
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
  describe('add npm plugin', function () {
    this.timeout(5000)

    beforeEach(async () => {
      appName = `add-npm-plugin-test-${Date.now()}`
      appPath = path.join(temp, appName)
      await createNewProject(temp, 'app', appName, defaultOptions)
    })

    it('should add a npm plugin to an app project', async () => {
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
        'const caches = [];',
        'const plugins = [{',
        '  instance: testProvider',
        '}];',
        'module.exports = [...outputs, ...auths, ...caches, ...plugins];'
      ].join(os.EOL)
      expect(plugins).to.equal(expected)

      const packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
      expect(packageInfo.dependencies['test-provider']).to.equal('^1.0.0')
    })

    it('should add a npm plugin published as a scoped module', async () => {
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
        'const caches = [];',
        'const plugins = [{',
        '  instance: testProvider',
        '}];',
        'module.exports = [...outputs, ...auths, ...caches, ...plugins];'
      ].join(os.EOL)
      expect(plugins).to.equal(expected)

      const packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
      expect(packageInfo.dependencies['@koop/test-provider']).to.equal('^1.0.0')
    })

    it('should add a npm plugin published with a version number', async () => {
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
        'const caches = [];',
        'const plugins = [{',
        '  instance: testProvider',
        '}];',
        'module.exports = [...outputs, ...auths, ...caches, ...plugins];'
      ].join(os.EOL)
      expect(plugins).to.equal(expected)

      const packageInfo = await fs.readJson(path.join(appPath, 'package.json'))
      expect(packageInfo.dependencies['@koop/test-provider']).to.equal('^3.2.1')
    })
  })
})
