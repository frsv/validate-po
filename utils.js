const fs = require('fs')
const path = require('path')
const gettextParser = require('gettext-parser')

const shallowCompare = (left, right) => {
    return Object.keys(left).every((key) => left[key] === right[key])
}

const tags = [
    // {value} format (react-intl)
    '\\{', '\\}',
    // %(value)s format (jed, django)
    '\\%\\(', '\\)s',
]

const getTagsCount = (string) => {
    const result = {}
    tags.map((tag) => {
        result[tag] = 0 
        const regex = new RegExp(tag, 'g')
        const match = string.match(regex)
        if (match) {
            result[tag] = match.length
        }
    })
    return result
}

const getFilesInfo = (paths) => {
    return paths.map((path) => ({
        path,
        isDirectory: fs.lstatSync(path).isDirectory(),
    }))
}

const getPaths = (filesData) => {
    let paths = []
    filesData.forEach((data) => {
        if (data.isDirectory) {
            paths = [...paths, ...fs.readdirSync(data.path).map((name) => path.join(data.path, name))]
        } else {
            paths = [...paths, data.path]
        }
    })
    return paths
}

const getPoTranslations = (path) => {
    const input = fs.readFileSync(path)
    const po = gettextParser.po.parse(input)
    return po.translations['']
}

module.exports = {
    shallowCompare,
    getTagsCount,
    getFilesInfo,
    getPaths,
    getPoTranslations,
}