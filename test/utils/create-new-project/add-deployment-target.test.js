/* eslint-env mocha */

const os = require('os')
const path = require('path')
const chai = require('chai')
const fs = require('fs-extra')
const createNewProject = require('../../../src/utils/create-new-project')
const Logger = require('../../../src/utils/logger')

const modulePath = '../../../src/utils/create-new-project/add-deployment-target'
const addDeploymentTarget = require(modulePath)

const expect = chai.expect
const temp = os.tmpdir()

const defaultOptions = {
  skipGit: true,
  skipInstall: true,
  quiet: true,
  logger: new Logger({ quiet: true })
}

let appName, appPath

describe('utils/create-new-project/add-deployment-target', function () {
  this.timeout(5000)

  beforeEach(async () => {
    appName = `add-deployment-target-test-${Date.now()}`
    appPath = path.join(temp, appName)
    await createNewProject(temp, 'app', appName, defaultOptions)
  })

  it('should throw an error if the deployment target is not recognized', async function () {
    try {
      await addDeploymentTarget(appPath, {
        deploymentTarget: 'no-such-thing'
      })

      throw new Error('should not pass')
    } catch (e) {
      expect(e).to.be.an('Error')
    }
  })

  it('should create a Dockerfile for the target "docker"', async function () {
    await addDeploymentTarget(appPath, {
      deploymentTarget: 'docker'
    })

    const expectedFile = path.join(appPath, 'Dockerfile')
    expect(await fs.pathExists(expectedFile)).to.equal(true)
  })
})
