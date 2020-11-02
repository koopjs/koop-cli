#!/usr/bin/env node

process.env.SUPPRESS_NO_CONFIG_WARNING = true

const yargs = require('yargs')
const middleware = require('./middleware')

module.exports = yargs
  .commandDir('commands')
  .middleware(middleware)
  .demandCommand()
  .showHelpOnFail(false)
  .help('help')
  .argv
