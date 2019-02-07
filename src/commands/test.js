const exec = require('../utils/exec-realtime')

exports.options = (yargs) => {
}

exports.handler = (argv) => {
  exec('npm test')
}
