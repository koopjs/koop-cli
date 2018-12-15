const shell = require('shelljs')

exports.options = (yargs) => {
}

exports.handler = (argv) => {
  shell.exec('npm run test')
}
