#!/usr/bin/env node

const commandLineArgs = require('command-line-args')
const validatePo = require('./lib/validate')

const optionDefinitions = [
    { name: 'src', type: String, multiple: true, defaultOption: true },
    { name: 'sourcefile', type: String },
    { name: 'help', alias: 'h', type: Boolean },
]

const options = commandLineArgs(optionDefinitions)
if (options.help) {
    const help = require('./help')
    const commandLineUsage = require('command-line-usage')
    console.log(commandLineUsage(help))
    return
}

const { src, sourcefile } = options
validatePo(src, sourcefile)
