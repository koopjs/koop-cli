const path = require('path')
const fs = require('fs-extra')
const execa = require('execa')
const addConfig = require('../add-config')
const setupGit = require('../setup-git')
const log = require('../log')
const scripts = require('../scripts')
const customizeProject = require('./customize-project')

/**
 * Creat a new koop project.
 * @param  {string}  cwd          work directory
 * @param  {string}  type         project type
 * @param  {string}  name         project name
 * @param  {Object}  [options={}] options
 * @param  {Object}  [options.config] configuration
 * @param  {boolean} [options.addServer]  add a server file for the provider project
 * @param  {boolean} [options.skipInstall]  skip dependency installation
 * @param  {boolean} [options.skipGit]  skip Git initialization
 * @return {Promise}              a promise
 */
module.exports = async (cwd, type, name, options = {}) => {
  const templatePath = path.join(__dirname, '../../templates', type, 'project')
  const projectPath = path.join(cwd, name)

  // create project folder
  await fs.ensureDir(projectPath)

  log('\u2713 created project folder', 'info', options)

  if (!options.skipGit) {
    await setupGit(projectPath)
    log('\u2713 initialized Git', 'info', options)
  }

  // copy project template
  await fs.copy(templatePath, projectPath)

  await customizeProject(projectPath, type, name, options)

  log(`\u2713 added ${type} template`, 'info', options)

  if (options.config) {
    await addConfig(projectPath, options.config)
    log(`\u2713 added ${type} configuration`, 'info', options)
  }

  if (!options.skipInstall) {
    const script = scripts.NPM_INSTALL
    // install dependencies
    await execa.shell(script, { cwd: projectPath })
    log('\u2713 installed dependencies', 'info', options)
  }

  log('\u2713 done', 'info', options)
}
