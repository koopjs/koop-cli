# list

The `list` command list plugins added into the current app. It based on the `plugins` list in the `koop.json` file and works best for projects fully managed by Koop CLI.

```
koop list [type]

list plugins added to the current app

Positionals:
  type  plugin type filter
                       [string] [choices: "output", "provider", "cache", "auth"]
```

The command will list plugins in a table in the terminal, for example

```
2 plugins are found.

#  Name           Type      Is local plugin?
-  -------------  --------  ----------------
1  test-output    output    true
2  test-provider  provider  true
```

If no plugin is found, nothing will be printed.

## API

List plugins

* `cwd`: Koop app directory
* `type`: optional plugin type filter

Return a promise.

``` javascript
const cli = require('@koopjs/cli')

// list providers in /Documents/my-app
cli
  .list('/Documents/my-app', 'provider')
  .then((plugins) => {
  /**
   * the "plugins" is an array like
   * [
   *  { type: "provider", name: "test-provider", local: "true" }
   * ]
   */
  })
```