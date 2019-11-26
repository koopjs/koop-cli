/* eslint-env mocha */

const chai = require('chai')
const expect = chai.expect

describe('authenticate', function () {
  it('should return a token and the expiration time', async () => {
    const authenticate = require('../src/authenticate')
    const result = await authenticate({})

    expect(result.token).to.be.a('string')
    expect(result.expires).to.be.a('number')
  })
})
