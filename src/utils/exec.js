const shell = require('shelljs')

module.exports = (cwd, command, errorMessage) => {
  shell.cd(cwd)

  const result = shell.exec(command)

  if (result.code !== 0) {
    throw new Error(errorMessage)
  }
}
