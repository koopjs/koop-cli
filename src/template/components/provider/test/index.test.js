/* eslint-env mocha */

const chai = require('chai')
const expect = chai.expect

describe('Koop provider', function () {
  it('should export required properties and functions', () => {
    const provider = require('../src/index')

    expect(provider.type).to.equal('provider')
    expect(provider.name).to.equal('koop-cli-new-provider')
    expect(provider.version).to.equal('0.1.0')
    expect(provider.Model).to.be.a('function')
  })
})
