const shell = require('shelljs')

module.exports = (command, errorMessage) => {
  const result = shell.exec(command)

  if (result.code !== 0) {
    throw new Error(errorMessage)
  }
}
