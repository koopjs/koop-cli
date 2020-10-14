/* eslint-env mocha */

const chai = require('chai')
const proxyquire = require('proxyquire')
const expect = chai.expect
const modulePath = '../../src/utils/manage-dependencies'

describe('utils/manage-dependencies', function () {
  it('should use npm to add dependency by default', async () => {
    const { addDependency } = proxyquire(modulePath, {
      execa: (command, options) => {
        expect(command).to.equal('npm install --quiet my-module')
        expect(options.cwd).to.equal('.')
      }
    })
    await addDependency('.', 'my-module')
  })

  it('should use npm to install dependencies by default', async () => {
    const { installDependencies } = proxyquire(modulePath, {
      execa: (command, options) => {
        expect(command).to.equal('npm install --quiet')
        expect(options.cwd).to.equal('.')
      }
    })
    await installDependencies('.')
  })

  it('should use npm to remove dependency by default', async () => {
    const { removeDependency } = proxyquire(modulePath, {
      execa: (command, options) => {
        expect(command).to.equal('npm uninstall --quiet my-module')
        expect(options.cwd).to.equal('.')
      }
    })
    await removeDependency('.', 'my-module')
  })

  it('should use yarn to add dependency if specified', async () => {
    const { addDependency } = proxyquire(modulePath, {
      execa: (command, options) => {
        expect(command).to.equal('yarn add --silent my-module')
        expect(options.cwd).to.equal('.')
      }
    })
    await addDependency('.', 'my-module', {
      npmClient: 'yarn'
    })
  })

  it('should use yarn to install dependencies if specified', async () => {
    const { installDependencies } = proxyquire(modulePath, {
      execa: (command, options) => {
        expect(command).to.equal('yarn install --silent')
        expect(options.cwd).to.equal('.')
      }
    })
    await installDependencies('.', {
      npmClient: 'yarn'
    })
  })

  it('should use yarn to remove dependency if specified', async () => {
    const { removeDependency } = proxyquire(modulePath, {
      execa: (command, options) => {
        expect(command).to.equal('yarn remove --silent my-module')
        expect(options.cwd).to.equal('.')
      }
    })
    await removeDependency('.', 'my-module', {
      npmClient: 'yarn'
    })
  })
})
