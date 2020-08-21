/* eslint-env mocha */

const os = require('os')
const path = require('path')
const chai = require('chai')
const fs = require('fs-extra')
const createNewProject = require('../../../src/utils/create-new-project')

const modulePath = '../../../src/utils/add-plugin'

const expect = chai.expect
const temp = os.tmpdir()

const defaultOptions = {
  skipGit: true,
  skipInstall: true,
  quiet: true,
  local: true
}

let appName, appPath

describe('utils/add-plugin', function () {
  describe('add local plugin', function () {
    this.timeout(5000)

    beforeEach(async () => {
      appName = `add-local-plugin-test-${Date.now()}`
      appPath = path.join(temp, appName)
      await createNewProject(temp, 'app', appName, defaultOptions)
    })

    it('should throw an error for unsupported plugin types', async () => {
      const addPlugin = require(modulePath)

      try {
        await addPlugin(appPath, 'output', 'plugins/test-provider', defaultOptions)
      } catch (err) {
        expect(err).to.be.an('error')
      }
    })

    it('should add a provider plugin from a local path', async () => {
      const addPlugin = require(modulePath)
      await addPlugin(appPath, 'provider', 'plugins/test-provider', defaultOptions)

      const plugins = await fs.readFile(path.join(appPath, 'src', 'plugins.js'), 'utf-8')
      const expected = [
        "const testProvider = require('./plugins/test-provider/initialize')();",
        'const outputs = [];',
        'const auths = [];',
        'const caches = [];',
        'const plugins = [testProvider];',
        'module.exports = [...outputs, ...auths, ...caches, ...plugins];'
      ].join(os.EOL)
      expect(plugins).to.equal(expected)

      const srcPath = path.join(appPath, 'src/plugins/test-provider')
      expect(await fs.pathExists(path.join(srcPath, 'index.js'))).to.equal(true)
      expect(await fs.pathExists(path.join(srcPath, 'model.js'))).to.equal(true)
      expect(await fs.pathExists(path.join(srcPath, 'initialize.js'))).to.equal(true)

      const testPath = path.join(appPath, 'test/plugins/test-provider')
      expect(await fs.pathExists(path.join(testPath, 'index.test.js'))).to.equal(true)
      expect(await fs.pathExists(path.join(testPath, 'model.test.js'))).to.equal(true)
    })

    it('should add an auth plugin from a local path', async () => {
      const addPlugin = require(modulePath)

      await addPlugin(appPath, 'auth', 'my-auth', defaultOptions)

      const plugins = await fs.readFile(path.join(appPath, 'src', 'plugins.js'), 'utf-8')
      const expected = [
        "const myAuth = require('./my-auth/initialize')();",
        'const outputs = [];',
        'const auths = [myAuth];',
        'const caches = [];',
        'const plugins = [];',
        'module.exports = [...outputs, ...auths, ...caches, ...plugins];'
      ].join(os.EOL)
      expect(plugins).to.equal(expected)

      const srcPath = path.join(appPath, 'src/my-auth')
      expect(await fs.pathExists(path.join(srcPath, 'index.js'))).to.equal(true)
      expect(await fs.pathExists(path.join(srcPath, 'authenticate.js'))).to.equal(true)
      expect(await fs.pathExists(path.join(srcPath, 'authorize.js'))).to.equal(true)
      expect(await fs.pathExists(path.join(srcPath, 'initialize.js'))).to.equal(true)
      expect(await fs.pathExists(path.join(srcPath, 'authentication-specification.js'))).to.equal(true)

      const testPath = path.join(appPath, 'test/my-auth')
      expect(await fs.pathExists(path.join(testPath, 'index.test.js'))).to.equal(true)
      expect(await fs.pathExists(path.join(testPath, 'authenticate.test.js'))).to.equal(true)
      expect(await fs.pathExists(path.join(testPath, 'authentication-specification.test.js'))).to.equal(true)
    })

    it('should add an output plugin from a local path', async () => {
      const addPlugin = require(modulePath)

      await addPlugin(appPath, 'output', 'my-output', defaultOptions)

      const plugins = await fs.readFile(path.join(appPath, 'src', 'plugins.js'), 'utf-8')
      const expected = [
        "const myOutput = require('./my-output/initialize')();",
        'const outputs = [myOutput];',
        'const auths = [];',
        'const caches = [];',
        'const plugins = [];',
        'module.exports = [...outputs, ...auths, ...caches, ...plugins];'
      ].join(os.EOL)
      expect(plugins).to.equal(expected)

      const srcPath = path.join(appPath, 'src/my-output')
      expect(await fs.pathExists(path.join(srcPath, 'index.js'))).to.equal(true)
      expect(await fs.pathExists(path.join(srcPath, 'routes.js'))).to.equal(true)
      expect(await fs.pathExists(path.join(srcPath, 'initialize.js'))).to.equal(true)
      expect(await fs.pathExists(path.join(srcPath, 'request-handlers/serve.js'))).to.equal(true)

      const testPath = path.join(appPath, 'test/my-output')
      expect(await fs.pathExists(path.join(testPath, 'index.test.js'))).to.equal(true)
      expect(await fs.pathExists(path.join(testPath, 'routes.test.js'))).to.equal(true)
      expect(await fs.pathExists(path.join(testPath, 'request-handlers/serve.test.js'))).to.equal(true)
    })
  })
})
