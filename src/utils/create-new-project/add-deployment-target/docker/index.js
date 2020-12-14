const path = require('path')
const fs = require('fs-extra')

module.exports = async (cwd) => {
  const src = path.join(__dirname, 'Dockerfile')
  const dest = path.join(cwd, 'Dockerfile')
  await fs.copyFile(src, dest)
}
