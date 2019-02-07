const execa = require('execa')

/**
 * Execute a command and print the console message in realtime
 * @param  {string} command command to execute
 */
module.exports = (command) => {
  const result = execa.shell(command)
  result.stdout.pipe(process.stdout)
  result.stderr.pipe(process.stderr)
}
