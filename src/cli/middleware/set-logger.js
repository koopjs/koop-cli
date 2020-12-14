const Logger = require('../../utils/logger')

module.exports = (argv) => {
  argv.logger = new Logger(argv)
}
