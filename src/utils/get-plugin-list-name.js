// this function returns the plugin list used for registration
module.exports = (type) => {
  if (type === 'output') {
    return 'outputs'
  } else if (type === 'auth') {
    return 'auths'
  } else if (type === 'cache') {
    return 'caches'
  } else {
    return 'plugins'
  }
}
