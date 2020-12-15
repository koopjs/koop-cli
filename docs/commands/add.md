# add

The `add` command adds a Koop plugin to the current Koop app.

```
koop add <type> <name>

Positionals:
  type  plugin type    [string] [choices: "output", "provider", "cache", "auth"]
  name  plugin name                                                     [string]

Provider Options:
  --route-prefix  add a prefix to all of a registered routes            [string]

Options:
  --config        specify the plugin configuration in JSON              [string]
  --skip-install  skip plugin installation            [boolean] [default: false]
  --local         add a local private plugin          [boolean] [default: false]
```

Then you can add options to customize the plugin. Take a look at the [Plugin Initialization](/docs/plugin-initialization.md) documentation for more details.

## API

Add a new plugin into an existing Koop app.

* `cwd`: Koop app directory
* `type`: plugin type
* `name`: plugin name
* `options`: same as command options

Return a promise.

``` javascript
const cli = require('@koopjs/cli')

// add a koop provider in /Documents/my-app
cli.add('/Documents/my-app', 'provider', 'my-provider', {
  config: {
    // plugin configuration
  }
})
```