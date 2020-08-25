/* eslint-env mocha */

const chai = require('chai')
const parse = require('../../../src/utils/add-plugin/parse-plugin-path')
const expect = chai.expect

describe('utils/add-plugin/parse-plugin-path', function () {
  it('should parse a path', async () => {
    const results = parse('plugins/test-provider')
    expect(results.moduleName).to.equal('test-provider')
    expect(results.fullModuleName).to.equal('test-provider')
    expect(results.srcPath).to.equal('plugins/test-provider')
  })
})
