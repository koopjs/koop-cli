const path = require('path')
const _ = require('lodash')
const fs = require('fs-extra')
const updatePackage = require('./update-package')
const writeJson = require('../write-formatted-json')

module.exports = async (cwd, type, name) => {
  const templatePath = path.join(__dirname, '../../templates/plugin')
  const componentPath = path.join(templatePath, 'components', type)
  const projectPath = path.join(cwd, name)

  // copy project template
  await fs.copy(path.join(templatePath, 'project'), projectPath)

  // copy components
  await fs.copy(path.join(componentPath, 'src'), projectPath)
  await fs.copy(path.join(componentPath, 'test'), projectPath)

  // add koop.json and package.json
  await updateInfo(componentPath, projectPath, 'koop.json')
  await updateInfo(componentPath, projectPath, 'package.json')

  // customize package.json
  await updatePackage(projectPath, type, name)

  // add default config
  const config = {
    [name]: {}
  }

  return writeJson(path.join(projectPath, 'config/default.json'), config)
}

async function updateInfo (componentPath, projectPath, infoFileName) {
  const pluginInfo = await fs.readJson(path.join(componentPath, infoFileName))
  const defaultInfo = await fs.readJson(path.join(projectPath, infoFileName))
  const info = _.merge(defaultInfo, pluginInfo)
  await writeJson(path.join(projectPath, infoFileName), info)
}
