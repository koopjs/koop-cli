const execa = require('execa')

exports.options = (yargs) => {
}

exports.handler = (argv) => {
  execa('npm test').stdout.pipe(process.stdout)
}
