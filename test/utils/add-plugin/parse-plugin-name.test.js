/* eslint-env mocha */

const chai = require('chai')
const parse = require('../../../src/utils/add-plugin/parse-plugin-name')
const expect = chai.expect

describe('utils/add-plugin/parse-plugin-name', function () {
  it('should parse a module name', async () => {
    const results = parse('@org/test-provider@^1.1.0')
    expect(results.moduleName).to.equal('test-provider')
    expect(results.fullModuleName).to.equal('@org/test-provider')
    expect(results.version).to.equal('^1.1.0')
    expect(results.srcPath).to.equal('test-provider')
    expect(results.installationName).to.equal('@org/test-provider@^1.1.0')
  })
})
