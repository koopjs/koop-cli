const path = require('path')
const fs = require('fs-extra')
const validateProvider = require('./validate-provider')

module.exports = async (cwd, options) => {
  const allowedTypes = ['provider']
  const koopConfig = await fs.readJson(path.join(cwd, 'koop.json'))

  // NOTE validation only works for some plugin types now
  if (!allowedTypes.includes(koopConfig.type)) {
    throw new Error(`The project type ${koopConfig.type} is not supported`)
  }

  let result

  if (koopConfig.type === 'provider') {
    result = await validateProvider(cwd, options)
  }

  return result
}
