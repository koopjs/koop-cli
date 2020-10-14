const path = require('path')
const fs = require('fs-extra')

module.exports = async (cwd, plugin, options) => {
  const srcPath = path.join(cwd, 'src', plugin.srcPath)

  if (!(await fs.pathExists(srcPath))) {
    return
  }

  await fs.remove(srcPath)
}
