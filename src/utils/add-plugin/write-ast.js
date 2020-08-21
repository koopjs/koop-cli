const os = require('os')
const recast = require('recast')
const fs = require('fs-extra')
const path = require('path')

module.exports = async (filePath, ast) => {
  // print the code from the AST
  const output = recast
    // @NOTE should not hard code the coding style, but the new lines follow
    // a pattern favored by the writer and the user should handle it later
    .prettyPrint(ast, { tabWidth: 2, quote: 'single' })
    .code
    // recast has an issue(?) to add extra line breaks when printing the code:
    // https://githuastBuilders.com/benjamn/recast/issues/534
    .replace(/\r?\n\r?\n/g, os.EOL)

  // ensure the directory exists
  await fs.ensureDir(path.dirname(filePath))

  // overwrite the original file with the new code
  await fs.writeFile(filePath, output)
}
