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
          json: async () => {
            return {
              'resultSet': {
                'queryTime': 1484267800763,
                'vehicle': [
                  {
                    'expires': 1484268019000,
                    'signMessage': '66 Hollywood TC',
                    'serviceDate': 1484208000000,
                    'loadPercentage': 0,
                    'latitude': 45.5003833,
                    'nextStopSeq': 13,
                    'type': 'bus',
                    'blockID': 6601,
                    'signMessageLong': '66  Hollywood TC',
                    'lastLocID': 142,
                    'nextLocID': 4537,
                    'locationInScheduleDay': 59054,
                    'newTrip': false,
                    'longitude': -122.675109,
                    'direction': 0,
                    'inCongestion': false,
                    'routeNumber': 66,
                    'bearing': 83,
                    'garage': 'CENTER',
                    'tripID': '7052979',
                    'delay': -725,
                    'extraBlockID': null,
                    'messageCode': 719,
                    'lastStopSeq': 12,
                    'vehicleID': 3101,
                    'time': 1484267780897,
                    'offRoute': false
                  }
                ]
              }
            }
          }
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
