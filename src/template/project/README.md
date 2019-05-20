# koop-cli-new-project

A minimal Koop project template from [Koop CLI](https://github.com/koopjs/koop-cli).

See the [specification](https://koopjs.github.io/docs/usage/koop-core) for more details.

## Configuration

This project is configured with [config](https://www.npmjs.com/package/config). As a community practice, it is recommanded to namespace the configuration for plugins in order to avoid any potential key conflict.

## Testing

This project uses [mocah](https://www.npmjs.com/package/mocha) as the testing framework. All test files in the `test` directory should have the extension `.test.js` and the `npm test` command will be able to run on them.
