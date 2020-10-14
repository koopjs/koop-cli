const path = require('path')
const fs = require('fs-extra')

const updateKoopConfig = require('./update-koop-config')
const removeSrc = require('./remove-src')
const removeTest = require('./remove-test')
const removeConfig = require('./remove-config')
const removeRegistration = require('./remove-registration')
const removeDepenency = require('./remove-dependency')

module.exports = async (cwd, name, options) => {
  const koopConfig = await fs.readJSON(path.join(cwd, 'koop.json'))

  if (koopConfig.type !== 'app') {
    throw new Error('The "remove" command can only be used in a Koop app project')
  }

  const plugin = koopConfig.plugins.find((plugin) => plugin.name === name)

  if (!plugin) {
    throw new Error(`The plugin "${name}" is not found`)
  }

  // remove dependency
  if (!plugin.local) {
    await removeDepenency(cwd, plugin, options)
  }

  // remove plugin code
  await removeSrc(cwd, plugin)
  await removeTest(cwd, plugin)

  // remove plugin registry
  await removeRegistration(cwd, plugin)

  // remove plugin config
  await removeConfig(cwd, plugin)

  // update plugin list
  await updateKoopConfig(cwd, plugin)
}
