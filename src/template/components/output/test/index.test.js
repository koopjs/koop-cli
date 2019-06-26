/* eslint-env mocha */

const chai = require('chai')
const expect = chai.expect

describe('Koop output', function () {
  it('should export required properties and functions', () => {
    const output = require('../src/index')

    expect(output.type).to.equal('output')
    expect(output.version).to.equal('0.1.0')
    expect(output.routes).to.be.an('array')
    expect(output.prototype.serve).to.be.a('function')
  })

  // it('should have valid')
})
