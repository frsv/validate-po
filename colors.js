const codes = {
    reset: [0, 0],
    underline: [4, 24],
    red: [31, 39],
    gray: [90, 39],
}

const applyCode = (code) => `\u001b[${code}m`

const colorize = (code, str) => {
    const [open, close] = code
    return `${applyCode(open)}${str}${applyCode(close)}`
}

const colors = new Proxy(codes, {
    calls: [],
    handler(str) {
        if (!str) return colors
        const result = this.calls.reduce((result, code) => colorize(codes[code], result), str)
        this.calls = []
        return result
    },
    get(target, prop) {
        if (target.hasOwnProperty(prop)) {
            this.calls.push(prop)
            return this.handler.bind(this)
        }
    },
})

module.exports = colors
