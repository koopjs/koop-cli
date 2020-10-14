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
  koop remove <name>      remove an existing plugin from the current app
  koop test               run tests in the current project
  koop serve [path]       run a Koop server for the current project

Options:
  --quiet    supress all console messages except errors
                                                      [boolean] [default: false]
```

Each command comes with the corresponding node.js API and this CLI can be used as a library. For detail information, please read the [command documentations](/docs/commands).
