# koop-cli

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

## Use

Once installed, the command `koop` will be available at the console:

``` bash
koop new provider koop-provider-github
```

## command

* **new**

The `new` command is used to create a new koop project from the template at the current location.

``` bash
koop new [project-type] [project-name]
```

The user can create two types of koop projects: app and provider.
