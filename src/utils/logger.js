module.exports = class Logger {
  constructor (options = {}) {
    this.options = options
  }

  info (data) {
    this.log(data, 'info')
  }

  warn (data) {
    this.log(data, 'warn')
  }

  error (data) {
    this.log(data, 'error')
  }

  log (data, level = 'log') {
    if (this.options.quiet && level !== 'error') {

    } else if (typeof data === 'string') {
      console[level](data)
    } else if (data instanceof Error) {
      console.error(data)
    }
  }
}
