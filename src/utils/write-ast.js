const os = require('os')
const recast = require('recast')
const fs = require('fs-extra')

module.exports = async (filePath, ast) => {
  // print the code from the AST
  const output = recast
    // @NOTE should not hard code the coding style, but the new lines follow
    // a pattern favored by the writer and the user should handle it later
    .prettyPrint(ast, { tabWidth: 2, quote: 'single' })
    .code
    // recast has an issue(?) to add extra line breaks when printing the code:
    // https://github.com/benjamn/recast/issues/534
    .replace(/\r?\n\r?\n/g, os.EOL)

  // overwrite the original file with the new code
  await fs.outputFile(filePath, output)
}
