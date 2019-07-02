module.exports = (dataPath) => {
  const Model = function ModelFunc (koop) {}

  Model.prototype.getData = function (req, callback) {
    callback(null, require(dataPath))
  }

  return {
    type: 'provider',
    name: 'dev-provider',
    version: '0.1.0',
    Model
  }
}
