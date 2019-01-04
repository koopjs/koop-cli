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
}

exports.handler = async (argv) => {
  const type = argv.type
  const name = argv.name
  const cwd = process.cwd()

  return createNewProject(cwd, type, name)
}
