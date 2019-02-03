const createNewProject = require('../utils/create-new-project')

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
}

exports.handler = async (argv) => {
  const type = argv.type
  const name = argv.name
  const cwd = process.cwd()

  return createNewProject(cwd, type, name, argv)
}
