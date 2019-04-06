const authenticate = require('./authenticate')
const authorize = require('./authorize')
const authenticationSpecification = require('./authentication-specification')

module.exports = {
  type: 'auth',
  authorize,
  authenticate,
  authenticationSpecification
}
