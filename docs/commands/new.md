# new

The `new` command creates a new Koop project from the template at the current location.

```
koop new <type> <name>

Positionals:
  type  project type
                         [string] [choices: "app", "provider", "auth", "output"]
  name  project name                                                    [string]

Options:
  --config        specify the project configuration in JSON             [string]
  --skip-install  skip dependence installation        [boolean] [default: false]
  --skip-git      do not initialize Git               [boolean] [default: false]
  --npm-client    an executable that knows how to install npm package
                  dependencies[string] [choices: "npm", "yarn"] [default: "npm"]
```

For more details on the project templates, please take a look at the Koop [specification](https://koopjs.github.io/docs/usage/koop-core) and [samples](https://github.com/koopjs?utf8=%E2%9C%93&q=sample).

## API

Create a Koop project in the given directory.

* `cwd`: work directory path
* `type`: project type
* `name`: project name
* `options`: same as command options

Return a promise.

``` javascript
const cli = require('@koopjs/cli')

// create a koop app project in /Documents
cli.new('/Documents', 'app', 'my-app', {
  config: {
    port: 8080
  }
})
```