const createNewProject = require('../utils/create-new-project')

function builder (yargs) {
  yargs
    .positional('type', {
      describe: 'project type',
      type: 'string',
      choices: ['app', 'provider', 'auth']
    })
    .positional('name', {
      describe: 'project name',
      type: 'string'
    })
    .option('config', {
      description: 'specify the project configuration in JSON',
      type: 'string'
    })
    .option('add-server', {
      description: 'add a server file to the new koop provider project',
      type: 'boolean',
      default: false,
      group: 'Provider Options:'
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
