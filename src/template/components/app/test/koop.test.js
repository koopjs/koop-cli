/* eslint-env mocha */

const fs = require('fs')
const chai = require('chai')
const path = require('path')
const expect = chai.expect

describe('koop.json', function () {
  const koopConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../koop.json'), 'utf-8'))

  it('should have a plugin list', () => {
    expect(koopConfig.plugins).to.be.an('array')
  })
})
