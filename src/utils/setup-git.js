const shell = require('shelljs')
const fetch = require('node-fetch')
const fs = require('fs-extra')
const path = require('path')

module.exports = async (cwd) => {
  shell.cd(cwd)
  shell.exec(`git init --quiet ${cwd}`)

  // add gitignore
  const res = await fetch('https://rawcdn.githack.com/github/gitignore/master/Node.gitignore')
  const gitignore = await res.text()

  return fs.outputFile(path.join(cwd, '.gitignore'), gitignore)
}
