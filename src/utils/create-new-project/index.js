const path = require('path')
const fs = require('fs-extra')
const updateProjectConfig = require('../update-project-config')
const setupGit = require('./setup-git')
const log = require('../log')
const { installDependencies } = require('../manage-dependencies')
const addComponents = require('./add-components')
const updatePackage = require('./update-package')
const updateKoopConfig = require('./update-koop-config')

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

  log('\u2713 created project', 'info', options)

  /**
   * Initialize Git
   */

  if (!options.skipGit) {
    await setupGit(projectPath)
    log('\u2713 initialized Git', 'info', options)
  }

  /**
   * Add project configuration
   */

  await updateProjectConfig(projectPath, type, name, options.config)
  log(`\u2713 added ${type} configuration`, 'info', options)

  /**
   * Install dependencies
   */

  if (!options.skipInstall) {
    // install dependencies
    await installDependencies(projectPath, options)
    log('\u2713 installed dependencies', 'info', options)
  }

  /**
   * Done
   */

  log('\u2713 done', 'info', options)
}
