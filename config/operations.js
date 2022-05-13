const UNARY_OPERATIONS = {
    '-': { func: a => -a }
}

const BINARY_OPERATIONS = {
    '+': { priority: 1, func: (a, b) => a + b },
    '-': { priority: 1, func: (a, b) => a - b },
    '*': { priority: 2, func: (a, b) => a * b },
    '/': { priority: 2, func: (a, b) => a / b }

}

module.exports = { UNARY_OPERATIONS, BINARY_OPERATIONS };