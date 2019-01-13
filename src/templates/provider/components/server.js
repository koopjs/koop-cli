// clean shutdown on `cntrl + c`
process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

// Initialize Koop
const Koop = require('koop')
const koop = new Koop()

// Install the Sample Provider
const provider = require('./index')
koop.register(provider)

// Start listening for HTTP traffic
const config = require('config')

// Set port for configuration or fall back to default
const port = config.port || 8080

koop.server.listen(port, () => {
  console.log(`Koop server listening at ${port}`)
})
