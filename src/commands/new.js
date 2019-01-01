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

exports.handler = async (argv) => {
  const projectType = argv.type
  const projectName = argv.name
  const templatePath = path.join(__dirname, '..', 'templates', projectType, 'project')
  const destPath = path.join(process.cwd(), projectName)

  // create project folder
  shell.mkdir('-p', destPath)

  if (!argv.skipGit) {
    shell.exec(`git init ${destPath}`)
  }

  // copy template
  shell.cp('-rf', path.join(templatePath, '*'), destPath)

  const info = {
    name: projectName,
    type: projectType,
    path: destPath
  }

  await customizeProject(info)

  if (!argv.skipInstall) {
    shell.cd(destPath)

    // install dependencies
    shell.exec('npm i')
  }
}

async function customizeProject (info) {
  const processes = []

  // modify package.json
  processes.push(customizePackage(info))

  if (info.type === 'app') {
    processes.push(customizeApp(info))
  } else if (info.type === 'provider') {
    processes.push(customizeProvider(info))
  }

  return Promise.all(processes)
}

async function customizePackage (info) {
  const packagePath = path.join(info.path, 'package.json')
  const packageInfo = await fs.readJson(packagePath)
  packageInfo.name = info.name
  return fs.writeJson(packagePath, packageInfo)
}

async function customizeApp (info) {

}

async function customizeProvider (info) {
  const configPath = path.join(info.path, 'config', 'default.json')
  const config = await fs.readJson(configPath)

  config[info.name] = config['koop-cli-new-provider']
  delete config['koop-cli-new-provider']

  return fs.writeJson(configPath, config)
}
