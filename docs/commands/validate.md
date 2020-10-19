# validate

The `validate` command validates the exports of a Koop plugin library based on the specification. If the plugin library doesn't export necessary or valid properties, this command will return a list of errors.

Currently support plugin types: provider

```
koop validate

validte the current plugin exports
```

The command will print the result of validation. If the validation passes,

```
The plugin is valid.
```

or if there is any error,


```
The plugin is not valid.

#  Property       Error
-  -------------  -----------------------------------
1  type           the value is empty
2  Model          the "getData" function is not added
```

## API

Validate the current plugin

* `cwd`: Koop app directory

Return a promise.

``` javascript
const cli = require('@koopjs/cli')

cli
  .validate('/Documents/my-provider')
  .then((result) => {
  /**
   * the "result" is an object
   * {
   *   // a boolean value indicating whether the validation is passed
   *   valid: false,
   *   errors: [
   *     { property: "type", message: "the message is empty" }
   *   ]
   * }
   *
   */
  })
```