module.exports = (argv) => {
  if (typeof argv.config === 'string') {
    argv.config = JSON.parse(argv.config)
  }
}
