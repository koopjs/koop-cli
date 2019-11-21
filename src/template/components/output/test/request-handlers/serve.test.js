/* eslint-env mocha */

const request = require('supertest')
const express = require('express')
const chai = require('chai')
const expect = chai.expect

const modulePath = '../../src/request-handlers/serve'

describe('request-handlers/serve', function () {
  it('should return data on success', (done) => {
    const serve = require(modulePath).bind({
      model: {
        pull (req, callback) {
          expect(req).to.be.an('object')

          const data = {
            type: 'FeatureCollection',
            features: []
          }

          callback(null, data)
        }
      }
    })

    const app = express()
    app.get('/', serve)

    request(app)
      .get('/')
      .expect(200, {
        type: 'FeatureCollection',
        features: []
      }, done)
  })

  it('should return 404 on no data', (done) => {
    const serve = require(modulePath).bind({
      model: {
        pull (req, callback) {
          expect(req).to.be.an('object')
          callback(null, null)
        }
      }
    })

    const app = express()
    app.get('/', serve)

    request(app)
      .get('/')
      .expect(404, done)
  })

  it('should return 500 on error', (done) => {
    const serve = require(modulePath).bind({
      model: {
        pull (req, callback) {
          expect(req).to.be.an('object')
          callback(new Error('it fails'))
        }
      }
    })

    const app = express()
    app.get('/', serve)

    request(app)
      .get('/')
      .expect(500, {
        message: 'it fails'
      }, done)
  })
})
