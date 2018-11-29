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

## Command

### new

The `new` command creates a new koop project from the template at the current location.

``` bash
koop new [project-type] [project-name]
```

The user can create different types of koop projects from templates:
* `provider` from [koop-cli-new-provider](https://github.com/haoliangyu/koop-cli-new-provider)
* `app` from [koop-cli-new-app](https://github.com/haoliangyu/koop-cli-new-app)

#### Example

Create a koop app project named `my-koop-project`

``` bash
koop new app my-koop-project
```

### serve

The `serve` command starts a test server for the current provider project, or starts the current koop app.

``` bash
koop serve
```

### add

The `add` command adds a koop plugin to the current koop app.

``` bash
koop add [plugin-type] [plugin-name]
```

#### Example

Add a koop provider [koop-provider-zillow](https://www.npmjs.com/package/koop-provider-zillow) to the current app

``` bash
koop add provider koop-provider-zillow
```
