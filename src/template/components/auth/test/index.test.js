/* eslint-env mocha */

const chai = require('chai')
const expect = chai.expect

describe('index', function () {
  it('should export required properties and functions', () => {
    const provider = require('../src/index')

    expect(provider.type).to.equal('auth')
    expect(provider.authenticationSpecification).to.be.a('function')
    expect(provider.authorize).to.be.a('function')
    expect(provider.authenticate).to.be.a('function')
  })
})
