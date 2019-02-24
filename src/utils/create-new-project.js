const path = require('path')
const fs = require('fs-extra')
const execa = require('execa')
const addConfig = require('./add-config')
const setupGit = require('./setup-git')
const log = require('./log')
const scripts = require('./scripts')

/**
 * Creat a new koop project.
 * @param  {string}  cwd          work directory
 * @param  {string}  type         project type
 * @param  {string}  name         project name
 * @param  {Object}  [options={}] options
 * @param  {Object}  [options.config] configuration
 * @param  {boolean} [options.addServer]  add a server file for the provider project
 * @param  {boolean} [options.noInstall]  add dependencies withoult actual installation
 * @param  {boolean} [options.noGit]  not to initialize git
 * @return {Promise}              a promise
 */
module.exports = async (cwd, type, name, options = {}) => {
  const templatePath = path.join(__dirname, '..', 'templates', type, 'project')
  const projectPath = path.join(cwd, name)

  // create project folder
  await fs.ensureDir(projectPath)

  log('\u2713 created project folder', 'info', options)

  if (!options.noGit) {
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

  if (!options.noGit) {
    const script = scripts.NPM_INSTALL
    // install dependencies
    await execa.shell(script, { cwd: projectPath })
    log('\u2713 installed dependencies', 'info', options)
  }

  log('\u2713 done', 'info', options)
}

async function customizeProject (path, type, name, options) {
  const processes = []

  // modify package.json
  processes.push(customizePackage(path, type, name, options))

  if (type === 'app') {
    processes.push(customizeApp(path, type, name, options))
  } else if (type === 'provider') {
    processes.push(customizeProvider(path, type, name, options))
  }

  return Promise.all(processes)
}

async function customizePackage (projectPath, type, name, options = {}) {
  const packagePath = path.join(projectPath, 'package.json')
  const packageConfig = await fs.readJson(packagePath)
  packageConfig.name = name

  // add npm script "start" if the provider project has a server option
  if (type === 'provider' && options.addServer) {
    packageConfig.scripts.start = 'node src/server.js'

    // add koop as a dependency since the original provider template does not
    // include it
    const koopConfig = await fs.readJson(path.join(projectPath, 'koop.json'))
    packageConfig.dependencies.koop = koopConfig.koopCompatibility
  }

  return fs.writeJson(packagePath, packageConfig)
}

async function customizeApp (projectPath, type, name) {

}

async function customizeProvider (projectPath, type, name, options = {}) {
  const configPath = path.join(projectPath, 'config/default.json')
  const config = await fs.readJson(configPath)

  config[name] = config['koop-cli-new-provider']
  delete config['koop-cli-new-provider']

  await fs.writeJson(configPath, config)

  // add a server file to the koop provider project so the user does not have to
  // publish the provider and use it without koop-cli
  if (options.addServer) {
    const serverPath = path.join(__dirname, '../templates', type, 'components/server.js')
    await fs.copy(serverPath, path.join(projectPath, 'src/server.js'))
  }
}
