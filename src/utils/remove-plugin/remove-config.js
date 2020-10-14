const path = require('path')
const fs = require('fs-extra')
const klawSync = require('klaw-sync')
const writeJson = require('../write-formatted-json')

module.exports = async (cwd, plugin) => {
  const configFiles = klawSync(path.join(cwd, 'config'), {
    nodir: true,
    filter: (item) => path.extname(item.path) === '.json'
  })

  const promises = configFiles.map(async (file) => {
    const config = await fs.readJson(file.path)

    if (config[plugin.name]) {
      delete config[plugin.name]
      await writeJson(file.path, config)
    }
  })

  return Promise.all(promises)
}
