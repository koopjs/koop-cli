/* eslint-env mocha */

const chai = require('chai')
const expect = chai.expect

const moduleName = '../../../src/utils/serve/get-provider'

describe('utils/serve/get-provider', () => {
  it('should return a provider', async () => {
    const getProvider = require(moduleName)
    const provider = getProvider()

    expect(provider.type).to.equal('provider')
    expect(provider.name).to.equal('dev-provider')
    expect(provider.version).to.equal('0.1.0')
    expect(provider.Model).to.be.a('function')
  })
})
