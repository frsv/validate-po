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
            [path]: [`"${colors.gray('Тестовая строка')}": Some translations are missed`],
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
})
