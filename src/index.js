const _ = require('lodash')
const createNewProject = require('./utils/create-new-project')
const addPlugin = require('./utils/add-plugin')
const removePlugin = require('./utils/remove-plugin')
const listPlugins = require('./utils/list-plugins')
const validatePlugin = require('./utils/validate-plugin')
const Logger = require('./utils/logger')

function getOptions (options) {
  return _.assign({
    // set "quiet" option to true to avoid additional log messages
    quiet: true,
    logger: new Logger(options)
  }, options)
}

module.exports = {
  new: (cwd, type, name, options) => {
    return createNewProject(cwd, type, name, getOptions(options))
  },
  add: (cwd, type, name, options) => {
    return addPlugin(cwd, type, name, getOptions(options))
  },
  remove: (cwd, name, options) => {
    return removePlugin(cwd, name, getOptions(options))
  },
  list: (cwd, type, options) => {
    return listPlugins(cwd, type, getOptions(options))
  },
  validate: (cwd, options) => {
    return validatePlugin(cwd, getOptions(options))
  }
}
