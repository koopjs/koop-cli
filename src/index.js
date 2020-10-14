const _ = require('lodash')
const createNewProject = require('./utils/create-new-project')
const addPlugin = require('./utils/add-plugin')
const removePlugin = require('./utils/remove-plugin')

// set "quiet" option to true to avoid additional log messages
module.exports = {
  new: (cwd, type, name, options) => {
    return createNewProject(cwd, type, name, _.assign({ quiet: true }, options))
  },
  add: (cwd, type, name, options) => {
    return addPlugin(cwd, type, name, _.assign({ quiet: true }, options))
  },
  remove: (cwd, name, options) => {
    return removePlugin(cwd, name, _.assign({ quiet: true }, options))
  }
}
