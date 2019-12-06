function Model (koop) {}

// each model should have a getData() function to fetch the geo data
// and format it into a geojson
Model.prototype.getData = function (req, callback) {
  const geojson = {
    type: 'FeatureCollection',
    features: []
  }

  // the callback function expects a geojson for its second parameter
  callback(null, geojson)
}

module.exports = Model
