# remove

The `remove` command removes a Koop plugin from the current Koop app. It reverts the result of the `add` command therefore this command works best with an app managed by Koop CLI.

The provider name could be found from the plugin list in the `koop.json`.

```
koop remove <name>

remove an existing plugin from the current app

Positionals:
  name  plugin name                                          [string] [required]

Options:
  --skip-install  skip plugin installation            [boolean] [default: false]
```

The command tries to perform these operations:

* Remove the initializer and test code
* Remove the plugin registration from `src/plugins`
* Remove the configuration from `config/*.json`
* Update the plugin list in `koop.json`
* Uninstall the plugin package if it is from npm

The command will ignore missing files/paths but any failure should stop the execution.

## API

Remove an existing plugin from an existing Koop app.

* `cwd`: Koop app directory path
* `name`: plugin name
* `options`: same as command options

Return a promise.

``` javascript
const cli = require('@koopjs/cli')

// remove the "my-provider" plugin from the app
cli.remove('/Documents/my-app', 'my-provider')
```