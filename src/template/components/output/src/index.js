const packageInfo = require('../package.json')
const serve = require('./request-handlers/serve')
const routes = require('./routes')

function Output () {}

Output.type = 'output'

Output.version = packageInfo.version

Output.routes = routes

Output.prototype.serve = serve

module.exports = Output
