const helpers = require('../helpers')

describe('shallowCompare', () => {
    it('should correctly compare two arrays', () => {
        expect(helpers.shallowCompare([1, 2, 3], [1, 2, 3])).toBeTruthy()
        expect(helpers.shallowCompare([1, 2, 3], [3, 2, 1])).toBeFalsy()
    })

    it('should correctly compare two strings, as string is object too', () => {
        const string = 'test string'
        expect(helpers.shallowCompare(string, string)).toBeTruthy()
        expect(helpers.shallowCompare(string, 'another string')).toBeFalsy()
    })

    it('should correctly compare two objects', () => {
        expect(helpers.shallowCompare({ x: 'value', y: 12345 }, { x: 'value', y: 12345 })).toBeTruthy()
        expect(helpers.shallowCompare({ x: 'value', y: 12345 }, {x: 12345, y: 'value' })).toBeFalsy()
    })

    it('should not compare deeply', () => {
        expect(helpers.shallowCompare({ x: { y: 'value' } }, { x: { y: 'value' } })).toBeFalsy()
    })
})

describe('getTagsCount', () => {
    it('return correct zero number of occurences of each tag for empty string', () => {
        expect(helpers.getTagsCount('')).toEqual({
            '\\{': 0,
            '\\}': 0,
            '\\%\\(': 0,
            '\\)s': 0,
        })
    })

    it('return correct number of occurences of each tag', () => {
        expect(helpers.getTagsCount('{value1}, %(value2)s')).toEqual({
            '\\{': 1,
            '\\}': 1,
            '\\%\\(': 1,
            '\\)s': 1,
        })
        expect(helpers.getTagsCount('{{{{{}}}}}')).toEqual({
            '\\{': 5,
            '\\}': 5,
            '\\%\\(': 0,
            '\\)s': 0,
        })
    })
})