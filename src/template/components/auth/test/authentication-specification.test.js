/* eslint-env mocha */

const chai = require('chai')
const expect = chai.expect

describe('authentication-specification', function () {
  it('should return an object', async () => {
    const spec = require('../src/authentication-specification')
    const result = await spec({})

    expect(result).to.be.an('object')
  })
})
