const colors = require('../colors')

describe('colors', () => {
    it('should return chain on call without argument', () => {
        expect(colors.underline()).toEqual(colors)
    })

    it('should stylize string on call with argument', () => {
        expect(colors.underline('test')).toContain('\u001b[4mtest\u001b[24m')
    })

    it('should stylize string in chain on last call with argument', () => {
        expect(colors.red().underline('test')).toContain('\u001b[4m\u001b[31mtest\u001b[39m\u001b[24m')
    })

    it('should return undefied for unsupported colors', () => {
        expect(colors.test).toBeUndefined()
    })
})