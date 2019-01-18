module.exports = (body, level = 'info', options = {}) => {
  if (options.quiet && level !== 'error') {
    return
  }

  if (body instanceof Error) {
    console.error(body)
  } else if (typeof body === 'string') {
    console[level](body)
  } else if (body.message) {
    console[level](body.message)
  }
}
