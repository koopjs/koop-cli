/* eslint-env mocha */

const os = require('os')
const path = require('path')
const fs = require('fs-extra')
const chai = require('chai')
const expect = chai.expect

const getPathArg = require('../../../src/utils/serve/get-path-arg')

describe('utils/serve/get-path-arg', () => {
  it('should quote the path in Linux/Max', function () {
    if (os.platform === 'win32') {
      this.skip()
    }

    expect(getPathArg('some path')).to.equal('"some path"')
  })

  it('should return a DOS short path with no space in Windows', async function () {
    if (os.platform !== 'win32') {
      this.skip()
    }

    const originPath = path.join(os.tmpdir, 'space space', 'secret.txt')
    const secretText = 'my secret'
    await fs.outputFile(originPath, secretText)

    const newPath = getPathArg(originPath)
    expect(newPath).to.not.include(' ')

    // verify the content again
    expect(await fs.readFile(newPath, 'utf-8')).to.equal(secretText)
  })
})
