#!/usr/bin/env node

process.env.SUPPRESS_NO_CONFIG_WARNING = true

const yargs = require('yargs')
const parseConfig = require('./utils/parse-config')

module.exports = yargs
  .commandDir('commands')
  .middleware([parseConfig])
  .demandCommand()
  .showHelpOnFail(false)
  .help('help')
  .argv
