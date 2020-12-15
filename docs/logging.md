# Logging

The CLI tool and its Node.js APIs use a simple [logger](../src/utils/logger.js) to log and manage all messages.

## Using your own logger

When using the Node.js API, you are able to inject your own in the options, logger as long as the logger implements the interface

``` typescript
interface ILogger {
  info (message: string) {}
  warn (message: string) {}
  error (message: string) {}
}
```

This is particularly useful when your system is using a centralized logger.

``` javascript
const logger = require('my-logger')
const koop = require('@koopjs/cli')

// set the logger in the options
koop.new('app', 'my-app', { logger })
```