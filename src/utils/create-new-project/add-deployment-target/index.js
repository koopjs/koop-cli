const targets = require('./targets')
const addDocker = require('./docker')

module.exports = async (cwd, options) => {
  const target = options.deploymentTarget

  if (!targets.includes(target)) {
    throw new Error(`Deployment target not supported: ${target}`)
  } else if (target === 'docker') {
    return addDocker(cwd)
  }
}
