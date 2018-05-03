const path = require('path')
const colors = require('colors')
const validatePo = require('../validate')

const fixture = (file) => path.join(__dirname, 'fixtures', file)

describe('validatePo', () => {
    it('should validate single file without errors', () => {
        const path = fixture('po/valid.po')
        expect(validatePo([path])).toEqual({
            [path]: [],
        })
    })

    it('should validate invalid po file with missed translation', () => {
        const path = fixture('po/missed_translation.po')
        expect(validatePo([path])).toEqual({
            [path]: [`"${colors.gray('Test string')}": Some translations are missed`],
        })
    })

    it('should validate invalid po file with translation which is a copy of msgid', () => {
        const path = fixture('po/translation_copies_msgid.po')
        expect(validatePo([path])).toEqual({
            [path]: [`"${colors.gray('Test string')}": Some translations are copy of msgid`],
        })
    })

    it('should validate invalid po file with translation which is a copy of msgid', () => {
        const path = fixture('po/translation_copies_msgid.po')
        expect(validatePo([path])).toEqual({
            [path]: [`"${colors.gray('Test string')}": Some translations are copy of msgid`],
        })
    })

    it('should validate invalid po file with translation missed tags', () => {
        const path = fixture('po/invalid_interpolation.po')
        expect(validatePo([path])).toEqual({
            [path]: [
                `"${colors.gray('Test string with %(value)s')}": Some translations either dont have all tags presented in msgid or have extra`,
                `"${colors.gray('Test string with {value} for react-intl')}": Some translations either dont have all tags presented in msgid or have extra`,
            ],
        })
    })

    it('should compare invalid msgids of every file and source if it passed', () => {
        const path = fixture('po/valid.po')
        expect(validatePo([path], fixture('source.po'))).toEqual({
            [path]: [
                `"${colors.gray('Another string')}": Msgid presented in source file, but missed in translated`,
                `"${colors.gray('Один перевод')}": Msgid presented in translated file, but missed in source`,
            ],
        })
    })

    it('should compare valid msgids of every file and source if it passed', () => {
        const path = fixture('po/valid.po')
        expect(validatePo([path], path)).toEqual({
            [path]: [],
        })
    })

    it('should handle EROENT error', () => {
        const path = fixture('not_exist.js')
        expect(validatePo([path])).toEqual({
            [path]: [`ENOENT: no such file or directory, lstat '${path}'`],
        })
    })

    it('should handle EROENT error for sourcefile', () => {
        const path = fixture('not_exist.js')
        expect(validatePo([fixture('po/valid.po')], path)).toEqual({
            [path]: [`ENOENT: no such file or directory, open '${path}'`],
        })
    })

    it('should show unhandled exceptions', () => {
        const path = fixture('invalid.js')
        expect(validatePo([path])).toEqual({
            unhandled: ['Cannot convert undefined or null to object'],
        })
    })
})
