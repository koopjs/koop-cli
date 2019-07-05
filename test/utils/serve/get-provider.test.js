/* eslint-env mocha */

const proxyquire = require('proxyquire')
const chai = require('chai')
const expect = chai.expect

const moduleName = '../../../src/utils/serve/get-provider'

describe('utils/serve/get-provider', () => {
  it('should return a provider', (done) => {
    const getProvider = proxyquire(moduleName, {
      'fs-extra': {
        async readJson (path) {
          expect(path).to.equal('/test/my-test-data.geojson')
          return 'data'
        }
      }
    })

    getProvider('/test/my-test-data.geojson')
      .then((provider) => {
        expect(provider.type).to.equal('provider')
        expect(provider.name).to.equal('dev-provider')
        expect(provider.version).to.equal('0.1.0')
        expect(provider.Model).to.be.a('function')

        provider.Model.prototype.getData({}, (err, data) => {
          expect(err).to.equal(null)
          expect(data).to.equal('data')
          done()
        })
      })
      .catch(done)
  })
})
