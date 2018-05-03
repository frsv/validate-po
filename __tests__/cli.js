const path = require('path')
const spawn = require('cross-spawn')

const fixture = (file) => path.join(__dirname, 'fixtures', file)

const run = (args) => {
    const options = { env: process.env }
    const cli = spawn(path.join(__dirname, '../cli.js'), args, options)
    return new Promise((resolve) => {
        let out = ''
        cli.stdout.on('data', (data) => {
            out += data.toString()
        })
        cli.stderr.on('data', (data) => {
            out += data.toString()
        })
        cli.on('close', (code) => {
            resolve({ code, out })
        })
    })
}

const getOutput = (out) => out.split('\n').map((x) => x.trimRight()).join('\n')

describe('cli', () => {
    const helpOutput = `
validate-po

  Validate po files for string translations, correct interpolations and errors

Options

  --src file          Folder with po files or paths of files
  --sourcefile file   Path to source file. If passed, additional validation,
                      that checks all msgid from source file are presented in
                      src .po files, will be fired.

Examples

  1. A short example.                     $ validate-po ./localizations
  2. A multi file example.                $ validate-po --src ./en.po ../ru.po
  3. An example with path to source.po    $ validate-po ./localizations
                                          --sourcefile ../source.po

`

    it('should show help if it is passed as argument', () => {
        return run(['--help']).then((result) => {
            expect(getOutput(result.out)).toEqual(helpOutput)
            expect(result.code).toEqual(0)
        })
    })

    it('should show help if it is passed as alias', () => {
        return run(['-h']).then((result) => {
            expect(getOutput(result.out)).toEqual(helpOutput)
            expect(result.code).toEqual(0)
        })
    })

    it('should run validation if src is passed and exit with status 0 if all files are valid', () => {
        return run([fixture('po/valid.po')]).then((result) => {
            expect(getOutput(result.out)).toEqual('')
            expect(result.code).toEqual(0)
        })
    })

    it('should run validation if src is passed and exit with status 1 if there are errors', () => {
        return run([fixture('po/missed_translation.po')]).then((result) => {
            expect(getOutput(result.out)).not.toEqual('')
            expect(result.code).toEqual(1)
        })
    })

    it('should fail if src file is not passed', () => {
        return run(['--src']).then((result) => {
            expect(result.out).toContain('Usage: "validate-po [--src] <path-to-file> [--sourcefile <path-to-file>] [--help]"')
            expect(result.code).toEqual(1)
        })
    })

    it('should fail if no arguments passed', () => {
        return run([]).then((result) => {
            expect(result.out).toContain('Usage: "validate-po [--src] <path-to-file> [--sourcefile <path-to-file>] [--help]"')
            expect(result.code).toEqual(1)
        })
    })
})