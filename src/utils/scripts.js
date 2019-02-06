const scripts = Object.freeze({
  NPM_INSTALL: 'npm install --quiet',
  NPM_INSTALL_QUICK: 'npm install --quiet --production --no-package-lock --no-audit',
  GIT_INIT: 'git init --quiet'
})

/**
 * a collection of scripts
 */
module.exports = scripts
