/* eslint-env mocha */

const chai = require('chai')
const expect = chai.expect

describe('index', function () {
  it('should export required properties and functions', () => {
    const output = require('../src/index')

    expect(output.type).to.equal('output')
    expect(output.routes).to.be.an('array')

    output.routes.forEach((route) => {
      expect(output.prototype[route.handler]).to.be.a('function')
    })
  })
})
