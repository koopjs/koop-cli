const path = require('path')
const fs = require('fs-extra')
const updatePackage = require('./update-package')

module.exports = async (cwd, type, name) => {
  const templatePath = path.join(__dirname, '../../templates', type)
  const projectPath = path.join(cwd, name)

  // copy project template
  await fs.copy(path.join(templatePath, 'project'), projectPath)

  // copy components
  await fs.copy(path.join(templatePath, 'components/src'), path.join(projectPath, 'src'))
  await fs.copy(path.join(templatePath, 'components/test'), path.join(projectPath, 'test'))

  // update package.json
  await updatePackage(projectPath, type, name)

  // add default config
  const config = {
    [name]: {}
  }

  return fs.writeJson(path.join(projectPath, 'config/default.json'), config)
}
