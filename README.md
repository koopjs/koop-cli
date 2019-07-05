# @koopjs/cli

[![npm package](https://img.shields.io/npm/v/@koopjs/cli.svg)](https://www.npmjs.com/package/@koopjs/cli) [![Build Status](https://travis-ci.org/koopjs/koop-cli.svg?branch=master)](https://travis-ci.org/koopjs/koop-cli)

An easy-to-use CLI tool to quickly build [Koop](https://github.com/koopjs/koop) applications and plugins

## Features

* follow [Koop specification](https://koopjs.github.io/docs/usage/koop-core)
* minimal project templates
* full development cycle support
* console commands + Node.js APIs
* cross-platform

## Install

Use npm

```
npm install -g @koopjs/cli
```

Use yarn

```
yarn global add @koopjs/cli
```

Once installed the `koop` command is available at the console.

## Example

Create a new Koop application with the name `my-koop-app`

``` bash
# create a project folder and initialize it
koop new app my-koop-app

# cd in the folder
cd my-koop-app
```

Add a provider [@koopjs/filesystem-s3](https://github.com/koopjs/koop-filesystem-s3) from npm

``` bash
# install the provider and register it to the koop app
koop add provider @koopjs/filesystem-s3
```

Add a custom provider that connects to a local database

``` bash
# add boilerplate provider files at src/providers/local-db and register it to
# the koop app (though you still need to implement the provider)
koop add provider providers/local-db --local
```

Test out your work

``` bash
# run the koop server
koop serve
```

## Commands

```
koop <command>

Commands:
  koop new <type> <name>  create a new koop project
  koop add <type> <name>  add a new plugin to the current app
  koop serve [path]       run a koop server for the current project
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
  type  project type
                         [string] [choices: "app", "provider", "auth", "output"]
  name  project name                                                    [string]

Options:
  --config        specify the project configuration in JSON             [string]
  --skip-install  skip dependence installation        [boolean] [default: false]
  --skip-git      do not initialize Git               [boolean] [default: false]
```

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
  --local         add a plugin from a local path                        [string]
  --config        specify the plugin configuration in JSON              [string]
  --add-to-root   add the given configuration to the app root configuration
                                                      [boolean] [default: false]
  --skip-install  skip plugin installation            [boolean] [default: false]
```

### serve

The `serve` command starts a test server for the current project.

For Koop apps, the command runs the app directly.

For Koop plugins, the command creates a Koop server that includes the plugin and a simple GeoJSON provider named `dev-provider` ([source](https://github.com/koopjs/koop-cli/tree/master/src/utils/serve/index.js)). This GeoJSON provider is only registered if the current Koop project is not a provider project. It makes sure the Koop server has an output ([geoservices](https://github.com/koopjs/koop-output-geoservices) by default) and a provider. When the GeoJSON provider is used, the `data` file path is required to provide test data (must be `*.geojson`).

```
koop serve [path]

run a koop server for the current project

Positionals:
  path  server file path                                                [string]

Options:
  --port, -p  port number of the server                                 [number]
  --data      path to a GeoJSON data file for testing Koop plugin       [string]
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
