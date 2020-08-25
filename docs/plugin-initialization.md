# Plugin Initialization

The `add` command creates an initialization function for each added plugin in its directory.

``` javascript
// src/plugin-name/initialize.js
const plugin = require('plugin-name')

function initialize () {
  return {
    instance: plugin
  }
}

module.exports = initialize
```

You can update the return of the initialization to provide options to the plugin registration.

``` javascript
function initialize () {
  return {
    instance: plugin,
    options: {
      // option values
    }
  }
}
```

## Customize Providers

The [Koop provider specification](https://koopjs.github.io/blog/2020/03/09/proivder-transformation-functions/) allows adding transformation functions in the registration options.

For example, the `before` option can be used to customize the data request before the request is fired. The pre-processing function can be defined in the initialization function and assigned to the `options` object.

``` javascript
function initialize () {
  return {
    instance: plugin,
    options: {
      // This pre-processer rejects any requests with id 'xyz'.
      before: (request, callback) => {
        const { params: { id } } = request

        if (id === 'xyz') {
          const error = new Error('Forbidden')
          error.code = 403
          return callback(error)
        }

        callback()
      }
    }
  }
}
```

Similarily, the `after` option can be used to modify the response of the data request.

``` javascript
function initialize () {
  return {
    instance: plugin,
    options: {
      // This post-processer reprojects the returned data into WGS84.
      after: (request, geojson, callback) => {
        const fromSR = `spatial_reference_definition`

        try {
          const wgs84Data = reproject(fromSR, proj4.wgs84, geojson)
          callback(null, wg484Data)
        } catch (err) {
          callback(err)
        }
      }
    }
  }
}
```

You can better organize the code by moving the pre-processer and post-processer into their separate files. So the initialization file can look cleaner as

``` javascript
const rejectInvalidRequests = require('./reject-invalid-requests')
const reprojectResult = require('./reproject-result')

function initialize () {
  return {
    instance: plugin,
    options: {
      before: rejectInvalidRequests,
      after: reprojectResult
    }
  }
}
```

By having all initialization files and customization files in a dedicated directory for each plugin, you can make the plugin registration much simpler and significantly improve your project file structure.