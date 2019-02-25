const fs = require('fs-extra')

/**
 * Write formatted JSON into a file.
 * @param  {string}  path file path
 * @param  {Object}  data JSON data
 * @return {Promise}      a promise
 */
module.exports = async (path, data) => {
  return fs.writeJson(path, data, {
    spaces: 2,
    EOL: '\n'
  })
}
