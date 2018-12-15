const path = require('path')
const shell = require('shelljs')
const fs = require('fs-extra')

exports.options = (yargs) => {
  yargs
    .positional('type', {
      describe: 'project type',
      type: 'string',
      choices: ['app', 'provider']
    })
    .positional('name', {
      describe: 'project name',
      type: 'string'
    })
}

exports.handler = (argv) => {
  const projectType = argv.type
  const projectName = argv.name
  const templatePath = path.join(__dirname, '..', 'templates', projectType, 'project')
  const destPath = path.join(process.cwd(), projectName)

  // copy template
  shell.cp('-rf', templatePath, destPath)
  shell.cd(destPath)

  const info = {
    name: projectName,
    type: projectType,
    path: destPath
  }

  customizeProject(info)

  if (argv.skipInstall) {
    return
  }

  // install dependencies
  shell.exec('npm i')
}

function customizeProject (info) {
  // modify package.json
  customizePackage(info)

  if (info.type === 'app') {
    customizeApp(info)
  } else if (info.type === 'provider') {
    customizeProvider(info)
  }
}

function customizePackage (info) {
  const packagePath = path.join(info.path, 'package.json')
  const packageInfo = fs.readJsonSync(packagePath)
  packageInfo.name = info.name
  fs.writeJsonSync(packagePath, packageInfo)
}

function customizeApp (info) {

}

function customizeProvider (info) {
  const configPath = path.join(info.path, 'config', 'default.json')
  const config = fs.readJsonSync(configPath)

  config[info.name] = config['koop-cli-new-provider']
  delete config['koop-cli-new-provider']

  fs.writeJsonSync(configPath, config)
}
