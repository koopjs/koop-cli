/* eslint-env mocha */

const chai = require('chai')
const expect = chai.expect

describe('routes', function () {
  it('should export required properties and functions', () => {
    const routes = require('../src/routes')
    expect(routes).to.be.an('array')

    routes.forEach((route) => {
      expect(route.path).to.be.a('string')
      expect(route.methods).to.be.an('array')
      expect(route.handler).to.be.a('string')
    })
  })
})
