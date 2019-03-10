const fs = require('fs-extra')
const path = require('path')

// read koop.json at the app directory
const config = fs.readJSONSync(path.join(process.cwd(), 'koop.json'))

let deployModule

if (config.deployer) {
  // if the deployer is specified, load the deployer
  deployModule = require(config.deployer)
} else {
  // export a default deploy command module, which is just to print the
  // deployer undefined error
  deployModule = {
    command: 'deploy',
    description: 'deploy the current koop application',
    builder: () => {},
    handler: () => {
      if (config.type !== 'app') {
        throw new Error('Only Koop app is supported.')
      }

      throw new Error('No Koop deployer is specified.')
    }
  }
}

// export a yargs command module
module.exports = deployModule
