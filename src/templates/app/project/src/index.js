const config = require('config')
const Koop = require('koop')

// initiate a koop app
const koop = new Koop()

const welcomeMessage = `
Welcome to Koop!

Installed Providers:
`

// This is how you implement additional arbitrary routes on the Koop server
koop.server.get('/', (req, res) => {
  res.status(200).send(welcomeMessage)
})

const port = config.get('port')

// start the server
koop.server.listen(port, () => koop.log.info(`Koop server listening at ${port}`))
