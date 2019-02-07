/* eslint-env mocha */

const chai = require('chai')
const fs = require('fs-extra')
const path = require('path')
const os = require('os')
const setupGit = require('../../src/utils/setup-git')

const expect = chai.expect
const temp = os.tmpdir()

let appName, appPath

describe('utils/setup-git', () => {
  beforeEach(async () => {
    appName = `test-${Date.now()}`
    appPath = path.join(temp, appName)
    await fs.ensureDir(appPath)
  })

  it('should create nodejs gitignore file', async () => {
    await setupGit(appPath)

    const gitFolder = path.join(appPath, '.git')
    expect(await fs.pathExists(gitFolder)).to.equal(true)

    const gitignorePath = path.join(appPath, '.gitignore')
    expect(await fs.pathExists(gitignorePath)).to.equal(true)
  })
})
