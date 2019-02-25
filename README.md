# @koopjs/cli

[![Build Status](https://travis-ci.org/koopjs/koop-cli.svg?branch=master)](https://travis-ci.org/koopjs/koop-cli)

A cross-platform CLI tool to build [Koop](https://github.com/koopjs/koop) projects

## Install

This library is not published but can be installed via GitHub URL.

Use npm

```
npm install -g https://github.com/koopjs/koop-cli.git
```

Use yarn

```
yarn global add https://github.com/koopjs/koop-cli.git
```

## Commands

Once installed the `koop` command is available.

```
koop <command>

Commands:
  koop new <type> <name>  create a new koop project
  koop add <type> <name>  add a new plugin to the current app
  koop test               run tests in the current project
  koop serve              run a koop server for the current project

Options:
  --quiet    supress all console messages except errors
                                                      [boolean] [default: false]
```

### new

The `new` command creates a new Koop project from the template at the current location.

```
koop new <type> <name>

Positionals:
  type  project type                       [string] [choices: "app", "provider"]
  name  project name                                                    [string]

Provider Options:
  --add-server  add a server file to the new koop provider project
                                                      [boolean] [default: false]

Options:
  --config        specify the project configuration in JSON             [string]
  --skip-install  skip dependence installation        [boolean] [default: false]
  --skip-git      do not initialize Git               [boolean] [default: false]
```

You can create different types of Koop projects from templates:
* **provider** from [koop-cli-new-provider](https://github.com/koopjs/koop-cli/tree/master/src/templates/provider/project)
* **app** from [koop-cli-new-app](https://github.com/koopjs/koop-cli/tree/master/src/templates/app/project)

For more details on the project templates, please take a look at the Koop [specification](https://koopjs.github.io/docs/usage/koop-core) and [samples](https://github.com/koopjs?utf8=%E2%9C%93&q=sample).

### add

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
  --add-to-root   add the given configuration to the app root configuration
                                                      [boolean] [default: false]
  --skip-install  skip plugin installation            [boolean] [default: false]
```

### serve

The `serve` command starts a test server for the current provider project, or starts the current Koop app.

```
koop serve

Options:
  --port, -p  port number of the server                                 [number]
```

### test

The `test` command run tests in the current koop project.

```
koop test
```

## APIs

This tool can be also used as a library.

``` javascript
const cli = require('@koopjs/cli')

// create a koop app project at /Documents
cli.new('/Documents', 'app', 'my-app', {
  config: {
    port: 8080
  }
})
```

### new(cwd, type, name, \[options\])

Create a Koop project at the given directory.

* `cwd`: current work directory
* `type`: project type
* `name`: project name

Return a promise.

### add(cwd, type, name, \[options\])

Add a plugin to the given Koop app

* `cwd`: Koop app directory
* `type`: project type
* `name`: Koop plugin name

Return a promise.
