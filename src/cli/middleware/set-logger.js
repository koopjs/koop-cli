const Logger = require('../logger')

module.exports = (argv) => {
  argv.logger = new Logger(argv)
}
