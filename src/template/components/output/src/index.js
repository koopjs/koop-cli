const serve = require('./serve')

function Output () {}

Output.version = require('../package.json').version

Output.type = 'output'

Output.routes = [
  {
    path: 'koop-cli-new-output',
    methods: ['get'],
    handler: 'serve'
  }
]

Output.prototype.serve = serve

module.exports = Output
