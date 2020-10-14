const path = require('path')
const fs = require('fs-extra')

module.exports = async (cwd, plugin) => {
  // tests are only added for local plugins
  if (!plugin.local) {
    return
  }

  const testPath = path.join(cwd, 'test', plugin.srcPath)

  if (!(await fs.pathExists(testPath))) {
    return
  }

  await fs.remove(testPath)
}
