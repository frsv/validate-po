const package = require('./package.json')

const sections = [
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

module.exports = sections