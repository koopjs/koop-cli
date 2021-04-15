const serve = require('./request-handlers/serve')
const routes = require('./routes')

function Output () { }

Output.type = 'output'

Output.version = '0.0.0'

Output.routes = routes

Output.prototype.serve = serve

module.exports = Output
