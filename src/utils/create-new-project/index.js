const path = require('path')
const fs = require('fs-extra')
const updateProjectConfig = require('../update-project-config')
const setupGit = require('./setup-git')
const { installDependencies } = require('../manage-dependencies')
const addComponents = require('./add-components')
const updatePackage = require('./update-package')
const updateKoopConfig = require('./update-koop-config')
const addDeploymentTarget = require('./add-deployment-target')

/**
 * Creat a new koop project.
 * @param  {string}  cwd          work directory
 * @param  {string}  type         project type
 * @param  {string}  name         project name
 * @param  {Object}  [options={}] options
 * @param  {Object}  [options.config] configuration
 * @param  {string}  [options.npmClient]    an executable to install packages
 * @param  {boolean} [options.skipInstall]  skip dependency installation
 * @param  {boolean} [options.skipGit]  skip Git initialization
 * @return {Promise}              a promise
 */
module.exports = async (cwd, type, name, options = {}) => {
  const projectPath = path.join(cwd, name)
  const { logger } = options

  /**
   * Create project directory and copy project template
   */

  // copy the template skeleton
  const templatePath = path.join(__dirname, '../../template/project')
  await fs.copy(templatePath, projectPath)

  // add type-specific components
  const componentPath = path.join(__dirname, '../../template/components', type)
  await addComponents(projectPath, componentPath)

  // update package.json and koop.json
  await updatePackage(projectPath, type, name)
  await updateKoopConfig(projectPath, type, name, options)

  logger.info('\u2713 created project')

  /**
   * Initialize Git
   */

  if (!options.skipGit) {
    await setupGit(projectPath)
    logger.info('\u2713 initialized Git')
  }

  /**
   * Add project configuration
   */

  await updateProjectConfig(projectPath, type, name, options.config)
  logger.info(`\u2713 added ${type} configuration`)

  /**
   * Install dependencies
   */

  if (!options.skipInstall) {
    // install dependencies
    await installDependencies(projectPath, options)
    logger.info('\u2713 installed dependencies')
  }

  if (options.addDeploymentTarget) {
    // add deployment target addon files
    await addDeploymentTarget(projectPath, options)
  }

  /**
   * Done
   */

  logger.info('\u2713 done')
}
