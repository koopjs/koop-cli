const fetch = require('node-fetch')
const fs = require('fs-extra')
const path = require('path')
const execa = require('execa')
const scripts = require('../scripts')

module.exports = async (cwd) => {
  await execa(scripts.GIT_INIT, { cwd, shell: true })

  // add gitignore
  const res = await fetch('https://rawcdn.githack.com/github/gitignore/master/Node.gitignore')
  const gitignore = await res.text()

  return fs.outputFile(path.join(cwd, '.gitignore'), gitignore)
}
