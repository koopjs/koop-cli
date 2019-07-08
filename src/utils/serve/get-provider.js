const fs = require('fs-extra')

module.exports = async (dataPath) => {
  const data = await fs.readJson(dataPath)
  const Model = function ModelFunc (koop) {}

  Model.prototype.getData = async function (req, callback) {
    callback(null, data)
  }

  return {
    type: 'provider',
    name: 'dev-provider',
    version: '0.1.0',
    disableIdParam: true,
    Model
  }
}
