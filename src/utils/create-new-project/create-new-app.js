const path = require('path')
const fs = require('fs-extra')
const updatePackage = require('./update-package')

module.exports = async (cwd, type, name) => {
  const templatePath = path.join(__dirname, '../../templates', type, 'project')
  const projectPath = path.join(cwd, name)

  // copy project template
  await fs.copy(templatePath, projectPath)

  // customize package.json
  await updatePackage(projectPath, type, name)
}
