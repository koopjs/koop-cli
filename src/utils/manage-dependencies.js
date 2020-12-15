const execa = require('execa')
const scripts = require('./scripts')

async function installDependencies (cwd, options = {}) {
  let installScript

  if (options.npmClient === 'yarn') {
    installScript = scripts.YARN_INSTALL
  } else {
    installScript = scripts.NPM_INSTALL
  }

  await execa(installScript, { cwd, shell: true })
}

async function addDependency (cwd, dependency, options = {}) {
  let installScript

  if (options.npmClient === 'yarn') {
    installScript = scripts.YARN_ADD
  } else {
    installScript = scripts.NPM_INSTALL
  }

  await execa(`${installScript} ${dependency}`, { cwd, shell: true })
}

async function removeDependency (cwd, dependency, options = {}) {
  let removeCommand

  if (options.npmClient === 'yarn') {
    removeCommand = scripts.YARN_REMOVE
  } else {
    removeCommand = scripts.NPM_UNINSTALL
  }

  await execa(`${removeCommand} ${dependency}`, { cwd, shell: true })
}

module.exports = {
  installDependencies,
  addDependency,
  removeDependency
}
