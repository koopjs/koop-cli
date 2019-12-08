const execa = require('execa')

module.exports = {
  command: 'test',
  description: 'run tests in the current project',
  builder: () => {},
  handler: (argv) => {
    execa('npm test', {
      shell: true,
      // use to maintain console colors
      stdio: 'inherit',
      cwd: process.cwd()
    })
  }
}
