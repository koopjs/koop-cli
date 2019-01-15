const path = require('path')
const shell = require('shelljs')
const fs = require('fs-extra')
const addConfig = require('./add-config')

module.exports = async (cwd, type, name, options = {}) => {
  const templatePath = path.join(__dirname, '..', 'templates', type, 'project')
  const destPath = path.join(cwd, name)

  // create project folder
  shell.mkdir('-p', destPath)

  if (!options.skipGit) {
    shell.exec(`git init ${destPath}`)

    // add gitignore
    shell.cp(
      path.join(__dirname, '../data/node.gitignore'),
      path.join(destPath, '.gitignore')
    )
  }

  // copy template
  shell.cp('-rf', path.join(templatePath, '*'), destPath)

  // cd to the work directory
  shell.cd(destPath)

  await customizeProject(destPath, type, name, options)

  if (options.config) {
    options.config = typeof options.config === 'string'
      ? JSON.parse(options.config)
      : options.config

    await addConfig(destPath, options.config)
  }

  if (!options.skipInstall) {
    // install dependencies
    shell.exec('npm i')
  }
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
  const packageInfo = await fs.readJson(packagePath)
  packageInfo.name = name

  // add npm script "start" if the provider project has a server option
  if (type === 'provider' && options.addServer) {
    packageInfo.scripts.start = 'node src/server.js'
  }

  return fs.writeJson(packagePath, packageInfo)
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
