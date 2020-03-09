const os = require('os')
const { execSync } = require('child_process')

// This function wraps a path into a command line argument. This is necessary
// because spaces in the path can break the command.
module.exports = (path) => {
  if (os.platform() === 'win32') {
    // For win, the path is resolved to DOS 8.3 format (with no space). See the
    // following link for details:
    // https://github.com/botpress/botpress/pull/338
    const shortPath = execSync(`@echo off && for %I in ("${path}") do echo %~sI`)
    return shortPath.toString('utf8').replace(/(\n|\r)+$/, '')
  } else {
    // For linux/mac, simply quoting the path should work.
    return `"${path}"`
  }
}
