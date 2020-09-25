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
  koop test               run tests in the current project
  koop serve [path]       run a Koop server for the current project

Options:
  --quiet    supress all console messages except errors
                                                      [boolean] [default: false]
```

For detailed information, please read the [command documentations](/docs/commands).

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
