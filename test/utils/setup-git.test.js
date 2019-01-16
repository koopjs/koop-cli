/* eslint-env mocha */

const chai = require('chai')
const shell = require('shelljs')
const path = require('path')
const setupGit = require('../../src/utils/setup-git')

const expect = chai.expect
const temp = path.join(__dirname, 'temp-setup-git')

let appName, appPath

describe('utils/setup-git', () => {
  before(() => {
    shell.mkdir('-p', temp)
  })

  beforeEach(() => {
    appName = `test-${Date.now()}`
    appPath = path.join(temp, appName)
    shell.mkdir('-p', appPath)
  })

  after(() => {
    shell.rm('-rf', temp)
  })

  it('should create nodejs gitignore file', async () => {
    await setupGit(appPath)

    const gitignorePath = path.join(appPath, '.gitignore')
    expect(shell.test('-e', gitignorePath)).to.equal(true)
  })
})
