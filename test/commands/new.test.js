const chai = require("chai");
const shell = require('shelljs');
const path = require('path')
const { handler } = require('../../src/commands/new')

const expect = chai.expect;
const temp = 'temp'

describe('new command', () => {
  afterEach(() => {
    if (shell.test('-e', temp)) {
      shell.rm('-rf', temp)
    }
  })

  it('should create a app project from the template', () => {
    handler({ name: 'test-app', type: 'app' })
    expect(shell('-e', temp)).to.be.true

    const packageInfo = require(path.join(temp, 'package.json'))
    expect(packageInfo.name).to.equal('test-app')

    const koopConfig = require()
  })
})
