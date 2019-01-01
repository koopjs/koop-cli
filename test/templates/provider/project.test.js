/* eslint-env mocha */

const chai = require('chai')
const path = require('path')
const fs = require('fs-extra')

const expect = chai.expect
const projectPath = path.join(__dirname, '../../../src/templates/provider/project')

describe('provider project template', () => {
  it('should have correct koop metadata', async () => {
    const koopConfigPath = path.join(projectPath, 'koop.json')
    const koopConfig = await fs.readJson(koopConfigPath)
    expect(koopConfig.type).to.equal('provider')
  })
})
