/* eslint-env mocha */

const os = require('os')
const path = require('path')
const chai = require('chai')
const createNewProject = require('../../src/utils/create-new-project')
const listPlugins = require('../../src/utils/list-plugins')
const addPlugin = require('../../src/utils/add-plugin')

const expect = chai.expect
const temp = os.tmpdir()

const defaultOptions = {
  skipGit: true,
  skipInstall: true,
  quiet: true,
  local: true
}

let appName, appPath

describe('utils/list-plugins', function () {
  this.timeout(5000)

  beforeEach(async () => {
    appName = `list-command-test-${Date.now()}`
    appPath = path.join(temp, appName)
    await createNewProject(temp, 'app', appName, defaultOptions)
  })

  it('should list plugins', async function () {
    let plugins = await listPlugins(appPath)
    expect(plugins).to.have.lengthOf(0)

    await addPlugin(appPath, 'provider', 'test-provider', defaultOptions)
    plugins = await listPlugins(appPath)

    expect(plugins).to.have.lengthOf(1)
    expect(plugins[0].name).to.equal('test-provider')
    expect(plugins[0].type).to.equal('provider')
    expect(plugins[0].local).to.equal(true)

    await addPlugin(appPath, 'output', 'test-output', defaultOptions)
    plugins = await listPlugins(appPath, 'provider')

    expect(plugins).to.have.lengthOf(1)
    expect(plugins[0].name).to.equal('test-provider')
  })
})
