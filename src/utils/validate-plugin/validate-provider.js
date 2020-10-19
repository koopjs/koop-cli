const createError = require('./create-validation-error')
const loadPlugin = require('./load-plugin')

module.exports = async (cwd) => {
  try {
    const pluginInstance = await loadPlugin(cwd)
    return isValidProvider(pluginInstance)
  } catch (error) {
    // TODO replace this with a new logger
    console.error('Unable to load and validate the provider')
    throw error
  }
}

function isValidProvider (plugin) {
  const errors = []

  if (plugin.type !== 'provider') {
    errors.push(createError('type', 'the value is not "provider"'))
  }

  if (!plugin.name) {
    errors.push(createError('name', 'the value is empty'))
  }

  if (!plugin.version) {
    errors.push(createError('version', 'the value is empty'))
  }

  if (!plugin.Model || typeof plugin.Model.prototype.getData !== 'function') {
    errors.push(createError('Model', 'the value is empty or the "getData" function is not added'))
  }

  if (errors.length === 0) {
    return { valid: true }
  } else {
    return { valid: false, errors }
  }
}
