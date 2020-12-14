/* eslint-env mocha */

const path = require('path')
const execa = require('execa')
const { expect } = require('chai')

describe('src/cli', () => {
  it('should load and run CLI commands', async () => {
    const packageInfo = require('../package.json')
    const cliPath = path.join(__dirname, '..', packageInfo.bin.koop)
    const { stdout } = await execa('node', [cliPath, '--version'])
    expect(stdout).to.equal(packageInfo.version)
  })
})
