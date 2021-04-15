const provider = {
  type: 'provider',
  version: '0.0.0',
  name: 'local-provider',
  hosts: false,
  disableIdParam: false,
  Model: require('./model')
}

module.exports = provider
