const fetch = require('node-fetch')
const fs = require('fs-extra')
const path = require('path')
const exec = require('./exec')

module.exports = async (cwd) => {
  exec(cwd, `git init --quiet ${cwd}`, 'failed to initialize Git')

  // add gitignore
  const res = await fetch('https://rawcdn.githack.com/github/gitignore/master/Node.gitignore')
  const gitignore = await res.text()

  return fs.outputFile(path.join(cwd, '.gitignore'), gitignore)
}
