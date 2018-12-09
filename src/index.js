#!/usr/bin/env node

const yargs = require('yargs')
const commands = require('./comands')

module.exports = yargs
  .command(
    'new [type] [name]',
    'create a new koop project',
    commands.new.options,
    commands.new.handler
  )
  .command(
    'test',
    'run tests in the current project',
    commands.test.options,
    commands.test.handler
  )
  .command(
    'serve',
    'run a koop server for the current project',
    commands.serve.options,
    commands.serve.handler
  )
  .demandCommand()
  .showHelpOnFail(true)
  .help('help').argv
