const path = require('path')
const fs = require('fs-extra')
const execa = require('execa')
const addConfig = require('../add-config')
const setupGit = require('./setup-git')
const log = require('../log')
const scripts = require('../scripts')
const addComponents = require('./add-components')
const updatePackage = require('./update-package')
const updateConfig = require('./update-config')

/**
 * Creat a new koop project.
 * @param  {string}  cwd          work directory
 * @param  {string}  type         project type
 * @param  {string}  name         project name
 * @param  {Object}  [options={}] options
 * @param  {Object}  [options.config] configuration
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
  await updateConfig(projectPath, type, name)

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

  if (options.config) {
    await addConfig(projectPath, options.config)
    log(`\u2713 added ${type} configuration`, 'info', options)
  }

  /**
   * Install dependencies
   */

  if (!options.skipInstall) {
    const script = scripts.NPM_INSTALL
    // install dependencies
    await execa(script, { cwd: projectPath, shell: true })
    log('\u2713 installed dependencies', 'info', options)
  }

  /**
   * Done
   */

  log('\u2713 done', 'info', options)
}
