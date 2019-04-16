module.exports = async (req) => {
  // Validate credentials and, if successful, issue a token for authorizing
  // subsequent resource requests

  // throw a 401 error if unable to authenticate
  // const error = new Error('Not Authorized')
  // error.code = 401
  // throw error

  // issue a token and the expiration time if successful.
  return {
    token: '',
    expires: 600
  }
}
