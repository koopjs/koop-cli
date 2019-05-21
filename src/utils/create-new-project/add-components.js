const path = require('path')
const _ = require('lodash')
const fs = require('fs-extra')

// klawSync() is a function to recursively walk the given directory and return
// an array of internal file/directory paths
const klawSync = require('klaw-sync')

module.exports = async (projectPath, componentPath) => {
  const componentExts = ['.js', '.json']

  // only get the component file paths, not directories
  const items = klawSync(componentPath, { nodir: true })

  for (const item of items) {
    if (!componentExts.includes(path.extname(item.path))) {
      continue
    }

    const relativePath = item.path.replace(componentPath, '')

    if (item.path.endsWith('.json')) {
      await addJson(projectPath, componentPath, relativePath)
    } else {
      await addFile(projectPath, componentPath, relativePath)
    }
  }
}

async function addJson (projectPath, componentPath, filePath) {
  const src = path.join(componentPath, filePath)
  const dest = path.join(projectPath, filePath)

  let data = {}

  if (await fs.pathExists(dest)) {
    data = await fs.readJson(dest)
  }

  const newData = await fs.readJson(src)
  _.merge(data, newData)

  return fs.writeJson(dest, data)
}

async function addFile (projectPath, componentPath, filePath) {
  const src = path.join(componentPath, filePath)
  const dest = path.join(projectPath, filePath)
  return fs.copy(src, dest)
}
