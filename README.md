# koop-cli

[![Build Status](https://travis-ci.org/haoliangyu/koop-cli.svg?branch=master)](https://travis-ci.org/haoliangyu/koop-cli) ![license](https://img.shields.io/github/license/haoliangyu/koop-cli.svg)

A CLI tool to build [Koop](https://github.com/koopjs/koop) providers and apps

## Install

Use npm

``` bash
npm install -g koop-cli
```

Use yarn

``` bash
yarn global add koop-cli
```

## Commands

Once installed the `koop` command is available.

``` bash
koop <command>

Commands:
  koop new [type] [name]  create a new koop project
  koop add [name]         add a new plugin to the current app
  koop test               run tests in the current project
  koop serve              run a koop server for the current project
```

### new

The `new` command creates a new koop project from the template at the current location.

``` bash
koop new [type] [name]

Positionals:
  type  project type                       [string] [choices: "app", "provider"]
  name  project name                                                    [string]

Options:
  --config      specify the project configuration in JSON               [string]
  --add-server  add a server file to the new koop provider project
                                                      [boolean] [default: false]
  --quiet       supress all console messages except errors
                                                      [boolean] [default: false]
```

You can create different types of koop projects from templates:
* **provider** from [koop-cli-new-provider](https://github.com/haoliangyu/koop-cli/tree/master/src/templates/provider/project)
* **app** from [koop-cli-new-app](https://github.com/haoliangyu/koop-cli/tree/master/src/templates/app/project)

### add

The `add` command adds a koop plugin to the current koop app.

``` bash
koop add [name]

Positionals:
  name  plugin name                                                     [string]

Options:
  --config       specify the plugin configuration in JSON               [string]
  --add-to-root  add the given configuration to the app root configuration
                                                      [boolean] [default: false]
  --quiet        supress all console messages except errors
                                                      [boolean] [default: false]
```

### serve

The `serve` command starts a test server for the current provider project, or starts the current koop app.

``` bash
koop serve

Options:
  --port, -p  port number of the server                                 [number]
```

### test

The `test` command run tests in the current koop project.

``` bash
koop test
```

## APIs

This tool can be also used as a library.

``` javascript
const cli = require('koop-cli')

// create a koop app project at /Documents
cli.new('/Documents', 'app', 'my-app', {
  config: {
    port: 8080
  }
})
```

### new(cwd, type, name, \[options\])

Create a koop project at the given directory.

* `cwd`: current work directory
* `type`: project type
* `name`: project name

### add(cwd, name, \[options\])

Add a plugin to the given koop project

* `cwd`: koop project directory
* `name`: koop plugin name
