const path = require('path')
const shell = require('shelljs')
const fs = require('fs-extra')

module.exports = async (cwd, type, name, options = {}) => {
  const templatePath = path.join(__dirname, '..', 'templates', type, 'project')
  const destPath = path.join(cwd, name)

  // create project folder
  shell.mkdir('-p', destPath)

  if (!options.skipGit) {
    shell.exec(`git init ${destPath}`)

    // add gitignore
    shell.cp(
      path.join(__dirname, 'data/node.gitignore'),
      path.join(destPath, '.gitignore')
    )
  }

  // copy template
  shell.cp('-rf', path.join(templatePath, '*'), destPath)

  // cd to the work directory
  shell.cd(destPath)

  await customizeProject(destPath, type, name)

  if (!options.skipInstall) {
    // install dependencies
    shell.exec('npm i')
  }
}

async function customizeProject (path, type, name) {
  const processes = []

  // modify package.json
  processes.push(customizePackage(path, type, name))

  if (type === 'app') {
    processes.push(customizeApp(path, type, name))
  } else if (type === 'provider') {
    processes.push(customizeProvider(path, type, name))
  }

  return Promise.all(processes)
}

async function customizePackage (projectPath, type, name) {
  const packagePath = path.join(projectPath, 'package.json')
  const packageInfo = await fs.readJson(packagePath)
  packageInfo.name = name
  return fs.writeJson(packagePath, packageInfo)
}

async function customizeApp (projectPath, type, name) {

}

async function customizeProvider (projectPath, type, name) {
  const configPath = path.join(projectPath, 'config', 'default.json')
  const config = await fs.readJson(configPath)

  config[name] = config['koop-cli-new-provider']
  delete config['koop-cli-new-provider']

  return fs.writeJson(configPath, config)
}
