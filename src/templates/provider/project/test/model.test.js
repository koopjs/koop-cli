/* eslint-env mocha */

/*
  model.test.js

  This file is optional, but is strongly recommended. It tests the `getData` function to ensure its translating
  correctly.
*/

const chai = require('chai')
const proxyquire = require('proxyquire')

const expect = chai.expect

describe('Koop provider - model', function () {
  it('should properly fetch from the API and translate features', (done) => {
    const Model = proxyquire('../src/model', {
      'node-fetch': async (url) => {
        expect(url).to.equal('www.test.com')

        return {
          json: async () => require('./fixtures/input.json')
        }
      },
      config: {
        'koop-cli-new-provider': {
          url: 'www.test.com'
        }
      }
    })
    const model = new Model()

    model.getData({}, (err, geojson) => {
      expect(err).to.equal(null)

      expect(geojson.type).to.equal('FeatureCollection')
      expect(geojson.features).to.be.an('array')

      const feature = geojson.features[0]
      expect(feature.type).to.equal('Feature')
      expect(feature.geometry.type).to.equal('Point')
      expect(feature.geometry.coordinates).to.deep.equal([-122.675109, 45.5003833])

      expect(feature.properties).to.be.an('object')
      expect(feature.properties.expires).to.equal(new Date(1484268019000).toISOString())
      done()
    })
  })
})
