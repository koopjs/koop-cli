const welcomePage = require('./request-handlers/welcome-page')

module.exports = [
  {
    path: '/',
    methods: ['get'],
    handler: welcomePage
  }
]
