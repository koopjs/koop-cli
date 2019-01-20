const path = require('path')
const shell = require('shelljs')
const fs = require('fs-extra')
const addConfig = require('./add-config')
const setupGit = require('./setup-git')
const log = require('./log')
const exec = require('./exec')

module.exports = async (cwd, type, name, options = {}) => {
  const templatePath = path.join(__dirname, '..', 'templates', type, 'project')
  const projectPath = path.join(cwd, name)

  // create project folder
  shell.mkdir('-p', projectPath)

  log('\u2611 created project folder', 'info', options)

  if (!options.skipGit) {
    await setupGit(projectPath)
    log('\u2611 initialized Git', 'info', options)
  }

  // copy template
  shell.cp('-rf', path.join(templatePath, '*'), projectPath)

  // cd to the work directory
  shell.cd(projectPath)

  await customizeProject(projectPath, type, name, options)

  log(`\u2611 added ${type} template`, 'info', options)

  if (options.config) {
    await addConfig(projectPath, options.config)
    log(`\u2611 added ${type} configuration`, 'info', options)
  }

  if (!options.skipInstall) {
    // install dependencies
    exec('npm i --silent', 'failed to install dependencies')
    log('\u2611 installed dependencies', 'info', options)
  }

  log('\u2611 done', 'info', options)
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
    shell.cp(serverPath, path.join(projectPath, 'src/server.js'))
  }
}
