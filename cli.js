#!/usr/bin/env node

const commandLineArgs = require('command-line-args')
const colors = require('colors')
const validatePo = require('./lib/validate')

const optionDefinitions = [
    { name: 'src', type: String, multiple: true, defaultOption: true },
    { name: 'sourcefile', type: String },
    { name: 'help', alias: 'h', type: Boolean },
]

const options = commandLineArgs(optionDefinitions)
if (options.help) {
    const package = require('./package.json')
    const help = [
        {
            header: package.name,
            content: package.description,
        },
        {
            header: 'Options',
            optionList: [
                {
                    name: 'src',
                    typeLabel: '{underline file}',
                    description: 'Folder with po files or paths of files',
                },
                {
                    name: 'sourcefile',
                    typeLabel: '{underline file}',
                    description: 'Path to source file. If passed, additional validation, that checks all msgid from source file are presented in src .po files, will be fired.',
                },
            ],
        },
        {
            header: 'Examples',
            content: [
                {
                    desc: '1. A short example. ',
                    example: '$ validate-po ./localizations',
                },
                {
                    desc: '2. A multi file example. ',
                    example: '$ validate-po --src ./en.po ../ru.po',
                },
                {
                    desc: '3. An example with path to source.po ',
                    example: '$ validate-po ./localizations --sourcefile ../source.po',
                },
            ],
        },
    ]
    const commandLineUsage = require('command-line-usage')
    console.log(commandLineUsage(help))
    return
}

const { src, sourcefile } = options

if (!src || !src.length) {
    console.error('Usage: "validate-po [--src] <path-to-file> [--sourcefile <path-to-file>] [--help]"')
    process.exit(1)
}

const validationResult = validatePo(src, sourcefile)
const hasErrors = Object.values(validationResult).some((errors) => !!errors.length)

if (hasErrors) {
    Object.entries(validationResult).forEach(([path, errors]) => {
        if (errors.length) {
            console.log(colors.red.underline(`${path}:`))
            console.log(`\t${errors.join('\n\t')}`)
        }
    })
    process.exit(1)
}
