const createNewProject = require('../../utils/create-new-project')
const deploymentTargets = require('../../utils/create-new-project/add-deployment-target/targets')

function builder (yargs) {
  yargs
    .positional('type', {
      describe: 'project type',
      type: 'string',
      choices: ['app', 'provider', 'auth', 'output']
    })
    .positional('name', {
      describe: 'project name',
      type: 'string'
    })
    .option('config', {
      description: 'specify the project configuration in JSON',
      type: 'string'
    })
    .option('skip-install', {
      description: 'skip dependence installation',
      type: 'boolean',
      default: false
    })
    .option('skip-git', {
      description: 'do not initialize Git',
      type: 'boolean',
      default: false
    })
    .option('npm-client', {
      description: 'an executable that knows how to install npm package dependencies',
      type: 'string',
      default: 'npm',
      choices: ['npm', 'yarn']
    })
    .option('deployment-target', {
      description: 'specify the app deployment target to add addon files',
      type: 'string',
      choices: deploymentTargets,
      group: 'App Options:'
    })
}

async function handler (argv) {
  const type = argv.type
  const name = argv.name
  const cwd = process.cwd()

  return createNewProject(cwd, type, name, argv)
}

module.exports = {
  command: 'new <type> <name>',
  description: 'create a new project',
  builder,
  handler
}
