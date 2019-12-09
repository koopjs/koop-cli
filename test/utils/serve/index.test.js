/* eslint-env mocha */

/**
 * Tests in this file use a callback style because the serve() function is not
 * a typical promised function. It executes a command or runs an express server,
 * both without an exit and don't use async/await. Using the done() callback is
 * a better way to mock the behavior but Mocha doesn't like callback and promise
 * returned in the same. So these tests do use the old-style promise-chain
 * (with no return) instead of the await function.
 */

const proxyquire = require('proxyquire')
const chai = require('chai')
const path = require('path')

const expect = chai.expect
const moduleName = '../../../src/utils/serve'

describe('utils/serve', () => {
  it('should run the given server file', async () => {
    const serve = proxyquire(moduleName, {
      execa: {
        command (command) {
          const expectedPath = path.join('/', 'app.js')
          expect(command).to.equal(`node ${expectedPath}`)
        }
      },
      'fs-extra': {
        async readJson () {
          return {}
        }
      }
    })

    return serve('/', { path: 'app.js' })
  })

  it('should run an app', async () => {
    const serve = proxyquire(moduleName, {
      execa: {
        command (command) {
          const expectedPath = path.join('/', 'src', 'index.js')
          expect(command).to.equal(`node ${expectedPath}`)
        }
      },
      'fs-extra': {
        async readJson (path) {
          if (path.endsWith('koop.json')) {
            return { type: 'app' }
          } else {
            return { main: 'src/index.js' }
          }
        }
      }
    })

    return serve('/')
  })

  it('should run a provider', async () => {
    const serve = proxyquire(moduleName, {
      execa: {
        command (command) {
          const expectedPath = path.join('/', 'serve-plugin')
          expect(command).to.equal(`node ${expectedPath} --cwd=/`)
        }
      },
      'fs-extra': {
        async readJson (path) {
          if (path.endsWith('koop.json')) {
            return { type: 'provider' }
          } else {
            return { main: 'src/index.js' }
          }
        }
      }
    })

    return serve('/', { dirname: '/' })
  })

  it('should run an output', async () => {
    const serve = proxyquire(moduleName, {
      execa: {
        command (command) {
          const expectedPath = path.join('/', 'serve-plugin')
          expect(command).to.equal(`node ${expectedPath} --cwd=/ --data-path=test.geojson`)
        }
      },
      'fs-extra': {
        async readJson (path) {
          if (path.endsWith('koop.json')) {
            return { type: 'output' }
          } else {
            return { main: 'src/index.js' }
          }
        },
        async pathExists () {
          return true
        }
      }
    })

    return serve('/', { data: 'test.geojson', dirname: '/' })
  })

  it('should run an auth', async () => {
    const serve = proxyquire(moduleName, {
      execa: {
        command (command) {
          const expectedPath = path.join('/', 'serve-plugin')
          expect(command).to.equal(`node ${expectedPath} --cwd=/ --data-path=test.geojson`)
        }
      },
      'fs-extra': {
        async readJson (path) {
          if (path.endsWith('koop.json')) {
            return { type: 'auth' }
          } else {
            return { main: 'src/index.js' }
          }
        },
        async pathExists () {
          return true
        }
      }
    })

    return serve('/', { data: 'test.geojson', dirname: '/' })
  })

  it('should throw an error for missing test data file', async () => {
    const serve = proxyquire(moduleName, {
      'fs-extra': {
        async readJson () {
          return { type: 'output' }
        },
        async pathExists () {
          return false
        }
      }
    })

    try {
      await serve('/', { data: null })
    } catch (e) {
      expect(e.message).to.equal('A GeoJSON file is requried to provide test data for the dev server.')
    }
  })

  it('could run in debug mode', async () => {
    const serve = proxyquire(moduleName, {
      execa: {
        command (command) {
          const expectedPath = path.join('/', 'app.js')
          expect(command).to.equal(`node --inspect ${expectedPath}`)
        }
      },
      'fs-extra': {
        async readJson () {
          return {}
        }
      }
    })

    return serve('/', { path: 'app.js', debug: true })
  })
})
