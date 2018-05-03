const fs = require('fs')
const gettextParser = require('gettext-parser')
const colors = require('colors')
const {
    getPaths,
    getFilesInfo,
    getTagsCount,
    shallowCompare,
} = require('./utils')

const translationsExists = (translations, msgid) => {
    if (!translations.length) {
        return `"${colors.gray(msgid)}": Translation is empty.`
    }

    return null
}

const translationsNotEmpty = (translations, msgid) => {
    if (!translations.every((translation) => !!translation)) {
        return `"${colors.gray(msgid)}": Some translations are missed`
    }

    return null
}

const translationsDifferentFromSource = (translations, msgid) => {
    if (!translations.every((translation) => translation !== msgid)) {
        return `"${colors.gray(msgid)}": Some translations are copy of msgid.`
    }

    return null
}

const translationsValidTags = (translations, msgid) => {
    const sourceTagsCount = getTagsCount(msgid)
    const validationResult = translations.every((translation) => {
        const translationTagsCount = getTagsCount(translation)
        return shallowCompare(translationTagsCount, sourceTagsCount)
    })

    if (!validationResult) {
        return `"${colors.gray(msgid)}": Some translations either dont have all tags presented in msgid or have extra.`
    }
}

const msgidsTheSameInSource = (translations, msgid, source) => {
    const translationsMsgids = translations.map((translation) => translation.msgid).sort()
    const sourceMsgids = source.map((translation) => translation.msgid).sort()
    if (!shallowCompare(translationsMsgids, sourceMsgids)) {
        return 'Msg ids for source file and translations are not the same'
    }
}

const validateKey = (translation, validators, ...rest) => {
    return validators.map((fn) => fn(translation.msgstr, translation.msgid, ...rest)).filter((result) => result)
}

const validatePoFileCreator = (validators) => (path, source) => {
    const input = fs.readFileSync(path)
    if (source) {
        source = fs.readFileSync(source)
    }
    const po = gettextParser.po.parse(input)
    const translations = po.translations['']
    const keys = Object.keys(translations)
    const errors = keys.reduce((errors, key) => [
        ...errors,
        ...validateKey(translations[key], validators, source),
    ], [])
    return errors
}

const validatePo = (files, sourcefile) => {
    const validateSourceFile = !!sourcefile
    const validators = [
        translationsExists,
        translationsNotEmpty,
        translationsDifferentFromSource,
        translationsValidTags,
    ]
    if (validateSourceFile) {
        validators.push(msgidsTheSameInSource)
    }
    const validatePoFile = validatePoFileCreator(validators)
    try {
        const filesData = getFilesInfo(files)
        const paths = getPaths(filesData)
        const validationErrors = {}
        paths.forEach((path) => validationErrors[path] = validatePoFile(path, sourcefile))
        return validationErrors
    } catch(error) {
        const { path, message } = error
        if (path) {
            return {[path]: [message]}
        }
    }
}

module.exports = validatePo