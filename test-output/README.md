# koop-cli-new-project

A minimal Koop project template from [Koop CLI](https://github.com/koopjs/koop-cli).

See the [specification](https://koopjs.github.io/docs/usage/koop-core) for more details.

## Configuration

This project is configured with [config](https://www.npmjs.com/package/config). As a community practice, it is recommanded to namespace the configuration for plugins in order to avoid any potential key conflict.

## Development

### Testing

This project uses [mocah](https://www.npmjs.com/package/mocha) as the testing framework and [chaijs](https://www.chaijs.com/) as the assertion library. All test files in the `test` directory should have the special extension `.test.js`, which will be executed by the command:

```
$ npm test
```

### Dev Server

This project by default uses the [Koop CLI](https://github.com/koopjs/koop-cli) to set up the dev server. It can be invoded via

```
$ npm start
```

The server will be running at `http://localhost:8080` or at the port specified at the configuration.

For more details, check the [Koop CLI documentation](https://github.com/koopjs/koop-cli/blob/master/README.md).
