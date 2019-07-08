/* eslint-env mocha */

/**
 * Tests in this file use a callback style because the serve() function is not
 * a typical promised function. It executes a command or runs an express server,
 * both without an exit and don't use async/await. Using the done() callback is
 * a better way to mock the behavior but Mocha doesn't like callback and promise
 * returned in the same. So these tests do use the old-style promise-chain
 * (with no return) instead of the await function.
 */

const os = require('os')
const path = require('path')
const proxyquire = require('proxyquire')
const chai = require('chai')
const createNewProject = require('../../../src/utils/create-new-project')

const temp = os.tmpdir()
const expect = chai.expect
const moduleName = '../../../src/utils/serve'

const defaultOptions = {
  skipGit: true,
  skipInstall: true,
  quiet: true
}

describe('utils/serve', function () {
  this.timeout(25000)

  it('should run the given server file', (done) => {
    const appName = `serve-test-${Date.now()}`
    const appPath = path.join(temp, appName)
    const serve = proxyquire(moduleName, {
      '../exec-realtime': (command) => {
        const expected = path.join(appPath, 'app.js')
        expect(command).to.equal(`node ${expected}`)
        done()
      }
    })

    createNewProject(temp, 'app', appName, defaultOptions)
      .then(() => serve(appPath, { path: 'app.js' }))
      .catch(done)
  })

  it('should run an app', (done) => {
    const appName = `serve-test-${Date.now()}`
    const appPath = path.join(temp, appName)
    const serve = proxyquire(moduleName, {
      '../exec-realtime': (command) => {
        const expected = path.join(appPath, 'src/index.js')
        expect(command).to.equal(`node ${expected}`)
        done()
      }
    })

    createNewProject(temp, 'app', appName, defaultOptions)
      .then(() => {
        serve(appPath)
      })
      .catch(done)
  })

  it('should run a provider', (done) => {
    const appName = `serve-test-${Date.now()}`
    const appPath = path.join(temp, appName)
    const serve = proxyquire(moduleName, {
      koop: class Koop {
        constructor () {
          this.server = {
            listen (port) {
              expect(port).to.equal(3000)
              done()
            }
          }
        }

        register (plugin) {
          expect(plugin.type).to.equal('provider')
        }
      }
    })

    createNewProject(temp, 'provider', appName, defaultOptions)
      .then(() => serve(appPath, { port: 3000 }))
      .catch(done)
  })

  it('should run an output', (done) => {
    const appName = `serve-test-${Date.now()}`
    const appPath = path.join(temp, appName)
    const registeredPlugins = ['output', 'provider']
    const serve = proxyquire(moduleName, {
      koop: class Koop {
        constructor () {
          this.server = {
            listen () {
              done()
            }
          }
        }

        register (plugin) {
          expect(plugin.type).to.equal(registeredPlugins.shift())
        }
      }
    })

    createNewProject(temp, 'output', appName, defaultOptions)
      .then(() => serve(appPath, { data: 'test/data.geojson' }))
      .then(() => {
        expect(registeredPlugins.length).to.equal(0)
      })
      .catch(done)
  })

  it('should run an auth', (done) => {
    const appName = `serve-test-${Date.now()}`
    const appPath = path.join(temp, appName)
    const registeredPlugins = ['auth', 'provider']
    const serve = proxyquire(moduleName, {
      koop: class Koop {
        constructor () {
          this.server = {
            listen () {
              done()
            }
          }
        }

        register (plugin) {
          expect(plugin.type).to.equal(registeredPlugins.shift())
        }
      }
    })

    createNewProject(temp, 'auth', appName, defaultOptions)
      .then(() => serve(appPath, { data: 'test/data.geojson' }))
      .then(() => {
        expect(registeredPlugins.length).to.equal(0)
      })
      .catch(done)
  })

  it('should throw an error for missing test data', (done) => {
    const appName = `serve-test-${Date.now()}`
    const appPath = path.join(temp, appName)
    const registeredPlugins = ['auth', 'provider']
    const serve = proxyquire(moduleName, {
      koop: class Koop {
        register (plugin) {
          expect(plugin.type).to.equal(registeredPlugins.shift())
        }
      }
    })

    createNewProject(temp, 'auth', appName, defaultOptions)
      .then(() => serve(appPath, { data: null }))
      .catch((err) => {
        expect(err.message).to.equal('A GeoJSON file is requried to provide test data for the dev server.')
        done()
      })
  })
})
