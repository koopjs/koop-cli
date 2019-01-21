/* eslint-env mocha */

const chai = require('chai')
const shell = require('shelljs')
const path = require('path')
const os = require('os')
const setupGit = require('../../src/utils/setup-git')

const expect = chai.expect
const temp = os.tmpdir()

let appName, appPath

describe('utils/setup-git', () => {
  beforeEach(() => {
    appName = `test-${Date.now()}`
    appPath = path.join(temp, appName)
    shell.mkdir('-p', appPath)
  })

  it('should create nodejs gitignore file', async () => {
    await setupGit(appPath)

    const gitFolder = path.join(appPath, '.git')
    expect(shell.test('-e', gitFolder)).to.equal(true)

    const gitignorePath = path.join(appPath, '.gitignore')
    expect(shell.test('-e', gitignorePath)).to.equal(true)
  })
})
