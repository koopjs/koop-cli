/* eslint-env mocha */

const os = require('os')
const path = require('path')
const chai = require('chai')
const api = require('../src/index.js')
const createNewProject = require('../src/utils/create-new-project')

const expect = chai.expect
const temp = os.tmpdir()

describe('Node.js APIs', () => {
  describe('new()', () => {
    it('should work', async () => {
      try {
        await api.new(temp, 'app', 'my-app', {
          skipInstall: true,
          skipGit: true
        })
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
      await createNewProject(temp, 'app', appName, {
        skipGit: true,
        skipInstall: true,
        quiet: true
      })
    })

    it('should work', async () => {
      try {
        await api.add(appPath, 'provider', 'my-provider', {
          skipInstall: true,
          // add a local plugin to avoid external requests
          local: true
        })
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

      await createNewProject(temp, 'app', appName, {
        skipGit: true,
        skipInstall: true,
        quiet: true
      })

      await api.add(appPath, 'provider', 'my-provider', {
        skipInstall: true,
        // add a local plugin to avoid external requests
        local: true
      })
    })

    it('should work', async () => {
      try {
        await api.remove(appPath, 'my-provider', {
          skipInstall: true
        })
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

      await createNewProject(temp, 'app', appName, {
        skipGit: true,
        skipInstall: true,
        quiet: true
      })
    })

    it('should work', async () => {
      try {
        await api.add(appPath, 'provider', 'my-provider', { local: true })
        await api.add(appPath, 'output', 'my-output', { local: true })

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

      await createNewProject(temp, 'provider', pluginName, {
        skipGit: true,
        skipInstall: true,
        quiet: true
      })
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
