const path = require('path')
const fs = require('fs-extra')
const execa = require('execa')
const addConfig = require('../add-config')
const setupGit = require('./setup-git')
const log = require('../log')
const scripts = require('../scripts')
const createNewApp = require('./create-new-app')
const createNewPlugin = require('./create-new-plugin')

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

  await fs.ensureDir(projectPath)

  if (type === 'app') {
    await createNewApp(cwd, type, name)
  } else {
    await createNewPlugin(cwd, type, name)
  }

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
    await execa.shell(script, { cwd: projectPath })
    log('\u2713 installed dependencies', 'info', options)
  }

  /**
   * Done
   */

  log('\u2713 done', 'info', options)
}
