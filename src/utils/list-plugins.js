const path = require('path')
const fs = require('fs-extra')
const _ = require('lodash')

module.exports = async (cwd, type) => {
  const koopConfig = await fs.readJson(path.join(cwd, 'koop.json'))
  const plugins = koopConfig.plugins.map(plugin => _.pick(plugin, ['name', 'type', 'local']))

  if (type) {
    return plugins.filter((plugin) => plugin.type === type)
  } else {
    return plugins
  }
}
