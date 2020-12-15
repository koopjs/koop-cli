# new

The `new` command creates a new Koop project from the template at the current location.

```
koop new <type> <name>

Positionals:
  type  project type
                         [string] [choices: "app", "provider", "auth", "output"]
  name  project name                                                    [string]

App Options:
  --deployment-target  specify the app deployment target to add addon files
                                                    [string] [choices: "docker"]
Options:
  --config        specify the project configuration in JSON             [string]
  --skip-install  skip dependence installation        [boolean] [default: false]
  --skip-git      do not initialize Git               [boolean] [default: false]
  --npm-client    an executable that knows how to install npm package
                  dependencies[string] [choices: "npm", "yarn"] [default: "npm"]
```

For more details on the project templates, please take a look at the Koop [specification](https://koopjs.github.io/docs/usage/koop-core) and [samples](https://github.com/koopjs?utf8=%E2%9C%93&q=sample).

### Deployment Target

When creating a new Koop app, you can specify the deployment target with the `--deployment-target`. The CLI can setup necessary addon files and changes for the cloud service to deploy. For example, if the deployment target is set to `docker`, a basic `Dockerfile` will be added into the project root directory.

The details of the deployment addons can be found in Koop's deployment guides:
* [Docker](https://koopjs.github.io/docs/deployment/docker)

## Node.js API

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