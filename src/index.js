// expose command API

const commands = require('./commands')

module.exports = {
  new: commands.new.handler,
  add: commands.add.handler
}
