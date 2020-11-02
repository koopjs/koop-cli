/* eslint-env mocha */

const os = require('os')
const path = require('path')
const chai = require('chai')
const proxyquire = require('proxyquire')
const createNewProject = require('../../../src/utils/create-new-project')
const Logger = require('../../../src/utils/logger')

const modulePath = '../../../src/utils/validate-plugin'
const validatePropertyPath = '../../../src/utils/validate-plugin/validate-provider'
const expect = chai.expect
const temp = os.tmpdir()

const defaultOptions = {
  skipGit: true,
  skipInstall: true,
  quiet: true,
  logger: new Logger({ quiet: true })
}

let pluginName, pluginPath

function getProvider () {
  function Model (koop) { }
  Model.prototype.getData = () => {}
  return {
    type: 'provider',
    name: 'provider-name',
    version: '1',
    Model
  }
}

describe('utils/validate-plugin', function () {
  describe('provider', function () {
    this.timeout(5000)

    beforeEach(async () => {
      pluginName = `validate-command-test-${Date.now()}`
      pluginPath = path.join(temp, pluginName)
      await createNewProject(temp, 'provider', pluginName, defaultOptions)
    })

    it('should return valid=true for a valid provider', async () => {
      const validatePlugin = require(modulePath)
      const result = await validatePlugin(pluginPath)
      expect(result.valid).to.equal(true)
      expect(result.errors).to.equal(undefined)
    })

    it('should return the valid=false and errors if the type property is incorrect', async () => {
      const provider = getProvider()
      provider.type = 'not-a-type'

      const validateProvider = proxyquire(validatePropertyPath, {
        './load-plugin': async () => provider
      })
      const validatePlugin = proxyquire(modulePath, {
        './validate-provider': validateProvider
      })

      const result = await validatePlugin(pluginPath)
      expect(result.valid).to.equal(false)
      expect(result.errors).to.have.lengthOf(1)
      expect(result.errors[0].property).to.equal('type')
    })

    it('should return the valid=false and errors if the name property is emtpy', async () => {
      const provider = getProvider()
      provider.name = null

      const validateProvider = proxyquire(validatePropertyPath, {
        './load-plugin': async () => provider
      })
      const validatePlugin = proxyquire(modulePath, {
        './validate-provider': validateProvider
      })

      const result = await validatePlugin(pluginPath)
      expect(result.valid).to.equal(false)
      expect(result.errors).to.have.lengthOf(1)
      expect(result.errors[0].property).to.equal('name')
    })

    it('should return the valid=false and errors if the version property is emtpy', async () => {
      const provider = getProvider()
      provider.version = null

      const validateProvider = proxyquire(validatePropertyPath, {
        './load-plugin': async () => provider
      })
      const validatePlugin = proxyquire(modulePath, {
        './validate-provider': validateProvider
      })

      const result = await validatePlugin(pluginPath)
      expect(result.valid).to.equal(false)
      expect(result.errors).to.have.lengthOf(1)
      expect(result.errors[0].property).to.equal('version')
    })

    it('should return the valid=false and errors if the Model property is emtpy', async () => {
      const provider = getProvider()
      provider.Model = null

      const validateProvider = proxyquire(validatePropertyPath, {
        './load-plugin': async () => provider
      })
      const validatePlugin = proxyquire(modulePath, {
        './validate-provider': validateProvider
      })

      const result = await validatePlugin(pluginPath)
      expect(result.valid).to.equal(false)
      expect(result.errors).to.have.lengthOf(1)
      expect(result.errors[0].property).to.equal('Model')
    })

    it('should return the valid=false and errors if the getData() function is emtpy', async () => {
      const provider = getProvider()
      provider.Model.prototype.getData = null

      const validateProvider = proxyquire(validatePropertyPath, {
        './load-plugin': async () => provider
      })
      const validatePlugin = proxyquire(modulePath, {
        './validate-provider': validateProvider
      })

      const result = await validatePlugin(pluginPath)
      expect(result.valid).to.equal(false)
      expect(result.errors).to.have.lengthOf(1)
      expect(result.errors[0].property).to.equal('Model')
    })
  })
})
