const path = require('path')
const utils = require('../utils')

const fixture = (file) => path.join(__dirname, 'fixtures', file)

describe('shallowCompare', () => {
    it('should correctly compare two arrays', () => {
        expect(utils.shallowCompare([1, 2, 3], [1, 2, 3])).toBeTruthy()
        expect(utils.shallowCompare([1, 2, 3], [3, 2, 1])).toBeFalsy()
    })

    it('should correctly compare two strings, as string is object too', () => {
        const string = 'test string'
        expect(utils.shallowCompare(string, string)).toBeTruthy()
        expect(utils.shallowCompare(string, 'another string')).toBeFalsy()
    })

    it('should correctly compare two objects', () => {
        expect(utils.shallowCompare({ x: 'value', y: 12345 }, { x: 'value', y: 12345 })).toBeTruthy()
        expect(utils.shallowCompare({ x: 'value', y: 12345 }, { x: 12345, y: 'value' })).toBeFalsy()
    })

    it('should not compare deeply', () => {
        expect(utils.shallowCompare({ x: { y: 'value' } }, { x: { y: 'value' } })).toBeFalsy()
    })
})

describe('getTagsCount', () => {
    it('return correct zero number of occurences of each tag for empty string', () => {
        expect(utils.getTagsCount('')).toEqual({
            '\\{': 0,
            '\\}': 0,
            '\\%\\(': 0,
            '\\)s': 0,
        })
    })

    it('return correct number of occurences of each tag', () => {
        expect(utils.getTagsCount('{value1}, %(value2)s')).toEqual({
            '\\{': 1,
            '\\}': 1,
            '\\%\\(': 1,
            '\\)s': 1,
        })
        expect(utils.getTagsCount('{{{{{}}}}}')).toEqual({
            '\\{': 5,
            '\\}': 5,
            '\\%\\(': 0,
            '\\)s': 0,
        })
    })
})

describe('getFilesInfo', () => {
    it('return isDirectory true for directory', () => {
        const path = fixture('po')
        expect(utils.getFilesInfo([path])).toEqual([{
            path,
            isDirectory: true,
        }])
    })

    it('return isDirectory false for non directory', () => {
        const path = fixture('po/valid.po')
        expect(utils.getFilesInfo([path])).toEqual([{
            path,
            isDirectory: false,
        }])
    })

    it('should throw an error for non existent file', () => {
        const path = fixture('not_exist.js')
        try {
            utils.getFilesInfo([path])
            fail('Unexpected')
        } catch (error) {
            expect(error.path).toEqual(path)
            expect(error.errno).toEqual(-2)
        }
    })
})

describe('getPaths', () => {
    it('return all files in directory', () => {
        expect(utils.getPaths([{ path: fixture('po'), isDirectory: true }]).sort()).toEqual([
            fixture('po/missed_translation.po'),
            fixture('po/valid.po'),
        ])
    })

    it('return path to single files', () => {
        const filesData = [
            { path: fixture('po/valid.po'), isDirectory: false },
            { path: fixture('po/missed_translation.po'), isDirectory: false },
        ]
        expect(utils.getPaths(filesData).sort()).toEqual([
            fixture('po/missed_translation.po'),
            fixture('po/valid.po'),
        ])
    })
})