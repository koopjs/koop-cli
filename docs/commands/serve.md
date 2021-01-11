# serve

The `serve` command starts a test server for the current project.

For Koop apps, the command runs the app directly.

For Koop plugins, the command creates a Koop server that includes the plugin and a simple GeoJSON provider named `dev-provider` ([source](https://github.com/koopjs/koop-cli/tree/master/src/utils/serve/index.js)). This GeoJSON provider is only registered if the current Koop project is not a provider project. It makes sure the Koop server has an output ([geoservices](https://github.com/koopjs/koop-output-geoservices) by default) and a provider. When the GeoJSON provider is used, the `data` file path is required to provide test data (must be `*.geojson`).

If a more customized test server is needed, you can provide your test server file path to the command.

```
koop serve [path]

run a koop server for the current project

Positionals:
  path  server file path                                                [string]

Options:
  --port      port number of the server                                 [number]
  --data      path to a GeoJSON data file for testing Koop plugin       [string]
  --debug     enable nodejs inspector for debugging                     [boolean]
  --watch     enable auto-restart on file change                        [boolean]
  --ssl-cert  path to the SSL certificate file                          [string]
  --ssl-key   path to the SSL key file                                  [string]
```

## HTTPS mode

You can create a HTTPS dev server for your plugin by providing both the SSL cert and key file paths.

For an app project, you still need to modify the server source code or use a proxy to provide HTTPS capability.

See the [Node.js HTTPS guide](https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/) for more information.