/* eslint-env mocha */

const os = require('os')
const path = require('path')
const chai = require('chai')
const api = require('../src/index.js')
const createNewProject = require('./test-helpers/create-new-project')

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
      await createNewProject(temp, 'app', appName)
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
})
