const colors = require('colors')
const {
    getPaths,
    getFilesInfo,
    getTagsCount,
    shallowCompare,
    getPoTranslations,
} = require('./utils')

const ERRORS = {
    EMPTY: (msgid) => `"${colors.gray(msgid)}": Some translations are missed`,
    SAME: (msgid) => `"${colors.gray(msgid)}": Some translations are copy of msgid`,
    INTERPOLATION: (msgid) => `"${colors.gray(msgid)}": Some translations either dont have all tags presented in msgid or have extra`,
    MISSED_TRANSLATED: (msgid) => `"${colors.gray(msgid)}": Msgid presented in source file, but missed in translated`,
    MISSED_SOURCE: (msgid) => `"${colors.gray(msgid)}": Msgid presented in translated file, but missed in source`,
}

const translationsNotEmpty = (translations) => {
    return Object.values(translations).reduce((errors, { msgid, msgstr }) => {
        if (!msgstr.every((translation) => !!translation)) {
            return [...errors, ERRORS.EMPTY(msgid)]
        }
        return errors
    }, [])
}

const translationsDifferentFromSource = (translations) => {
    return Object.values(translations).reduce((errors, { msgid, msgstr }) => {
        if (!msgstr.every((translation) => translation !== msgid)) {
            return [...errors, ERRORS.SAME(msgid)]
        }
        return errors
    }, [])
}

const translationsValidTags = (translations) => {
    return Object.values(translations).reduce((errors, { msgid, msgstr }) => {
        const sourceTagsCount = getTagsCount(msgid)
        const validationError = msgstr.some(
            (translation) => !shallowCompare(getTagsCount(translation), sourceTagsCount))
        return validationError ? [...errors, ERRORS.INTERPOLATION(msgid)] : errors
    }, [])
}

const msgidsTheSameInSource = (translations, source) => {
    const translatedKeys = Object.keys(translations)
    const sourceKeys = Object.keys(source)
    if (!shallowCompare(translatedKeys, sourceKeys)) {
        const missedInTranslation = sourceKeys.filter((x) => !translatedKeys.includes(x))
        const missedInSource = translatedKeys.filter((x) => !sourceKeys.includes(x))
        const translatedError = missedInTranslation.map(ERRORS.MISSED_TRANSLATED)
        const sourceError = missedInSource.map(ERRORS.MISSED_SOURCE)

        return [...translatedError, ...sourceError]
    }
    return []
}

const validate = (translations, validators, ...rest) => {
    return validators.reduce((errors, fn) => (
        [...errors, ...fn(translations, ...rest)]
    ), [])
}

const validatePoFileCreator = (validators) => (path, sourcefile) => {
    const translations = getPoTranslations(path)
    const sourceTranslations = sourcefile ? getPoTranslations(sourcefile) : void 0
    return validate(translations, validators, sourceTranslations)
}

const validatePo = (files, sourcefile) => {
    const validateSourceFile = !!sourcefile
    const validators = [
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
        return { unhandled: [message] }
    }
}

module.exports = validatePo