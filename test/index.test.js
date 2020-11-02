/* eslint-env mocha */

const os = require('os')
const path = require('path')
const chai = require('chai')
const api = require('../src/index.js')
const createNewProject = require('../src/utils/create-new-project')
const Logger = require('../src/utils/logger')

const expect = chai.expect
const temp = os.tmpdir()

const defaultOptions = {
  skipGit: true,
  skipInstall: true,
  quiet: true,
  local: true,
  logger: new Logger({ quiet: true })
}

describe('Node.js APIs', () => {
  describe('new()', () => {
    it('should work', async () => {
      try {
        await api.new(temp, 'app', 'my-app', defaultOptions)
      } catch (e) {
        expect.fail(e.message)
      }
    })
  })

  describe('add()', () => {
    let appName, appPath

    beforeEach(async () => {
      appName = `add-api-test-${Date.now()}`
      appPath = path.join(temp, appName)
      await createNewProject(temp, 'app', appName, defaultOptions)
    })

    it('should work', async () => {
      try {
        await api.add(appPath, 'provider', 'my-provider', defaultOptions)
      } catch (e) {
        expect.fail(e.message)
      }
    })
  })

  describe('remove()', () => {
    let appName, appPath

    beforeEach(async () => {
      appName = `remove-api-test-${Date.now()}`
      appPath = path.join(temp, appName)

      await createNewProject(temp, 'app', appName, defaultOptions)

      await api.add(appPath, 'provider', 'my-provider', defaultOptions)
    })

    it('should work', async () => {
      try {
        await api.remove(appPath, 'my-provider', defaultOptions)
      } catch (e) {
        expect.fail(e.message)
      }
    })
  })

  describe('list()', () => {
    let appName, appPath

    beforeEach(async () => {
      appName = `list-api-test-${Date.now()}`
      appPath = path.join(temp, appName)

      await createNewProject(temp, 'app', appName, defaultOptions)
    })

    it('should work', async () => {
      try {
        await api.add(appPath, 'provider', 'my-provider', defaultOptions)
        await api.add(appPath, 'output', 'my-output', defaultOptions)

        const plugins = await api.list(appPath, 'output')
        expect(plugins).to.have.lengthOf(1)
      } catch (e) {
        expect.fail(e.message)
      }
    })
  })

  describe('validate()', () => {
    let pluginName, pluginPath

    beforeEach(async () => {
      pluginName = `validate-api-test-${Date.now()}`
      pluginPath = path.join(temp, pluginName)

      await createNewProject(temp, 'provider', pluginName, defaultOptions)
    })

    it('should work', async () => {
      try {
        const result = await api.validate(pluginPath)
        expect(result.valid).to.equal(true)
        expect(result.errors).to.equal(undefined)
      } catch (e) {
        expect.fail(e.message)
      }
    })
  })
})
