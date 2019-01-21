const _ = require('lodash')
const createNewProject = require('./utils/create-new-project')
const addPlugin = require('./utils/add-plugin')

// set "quiet" option to truee to avoid additional log messages
module.exports = {
  new: (cwd, type, name, options) => {
    return createNewProject(cwd, type, name, _.assign({ quiet: true }, options))
  },
  add: (cwd, name, options) => {
    return addPlugin(cwd, name, _.assign({ quiet: true }, options))
  }
}
