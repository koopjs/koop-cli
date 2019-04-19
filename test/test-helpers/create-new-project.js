const path = require('path')
const fs = require('fs-extra')

module.exports = async function createNewProject (cwd, type, name) {
  const templatePath = path.resolve(__dirname, '../../src/templates/app/project')
  const projectPath = path.join(cwd, name)

  // just copy the app template and no need to use the formal project creator
  // (skip some file I/O)
  await fs.ensureDir(projectPath)
  await fs.copy(templatePath, projectPath)
}
