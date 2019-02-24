const exec = require('../utils/exec-realtime')

module.exports = {
  command: 'test',
  description: 'run tests in the current project',
  builder: () => {},
  handler: (argv) => {
    exec('npm test')
  }
}
