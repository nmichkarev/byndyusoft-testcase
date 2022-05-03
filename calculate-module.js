const OPERATIONS = {
    '+': { priority: 1, func: (a, b) => a + b },
    '-': { priority: 1, func: (a, b) => a - b },
    '*': { priority: 2, func: (a, b) => a * b },
    '/': { priority: 2, func: (a, b) => a / b }
}

/**
 * Main function
 * @throws {SyntaxError}
 * @param {string} input 
 * @returns {number} total result
 */
function calculate(input = '') {
    const [operands, operations] = parse(input);
    return solveFlatExpression(operands, operations);
}

/**
 * Extracts numbers and math operations chars to separate arrays.
 * Recursively calls 'calculate' function for expressions in parentheses.
 * @param {string} input 
 * @returns {[[number], [string]]} ex: [[1, 2, 3, 4], ['+', '-', '*']]
 */
 function parse(input) {
    const operands     = [];
    const operations   = [];
    let numStartIndex  = null,
        lastOperation  = null, 
        gotParentheses = false, 
        i = 0;

    input = input.replace(/\s/g, '');

    while(i < input.length) {

        const char         = input[i];
        const isOperation  = char in OPERATIONS;
        const isDigit      = /\d|\./.test(char);
        const errorMessage = `Syntax error near "${char}"`;
        

        // met ) before (
        if (char === ')') throw new SyntaxError(errorMessage);

        if (char === '(') {
            const closingPar = findClosingParenthese(input, i);

            // "(" without ")"
            if (!closingPar) throw new SyntaxError(errorMessage);
            
            operands.push(
                calculate(input.slice(i + 1, closingPar))
            );

            i = closingPar + 1; // jump to the end of parentheses
            gotParentheses = true;
            continue;
        }
        if (!isOperation) lastOperation = null;

        // incorrect symbol
        if (!isOperation && !isDigit) throw new SyntaxError(errorMessage);

        // two operations in a row
        if (isOperation && lastOperation !== null) 
            throw new SyntaxError(errorMessage);

        if (isDigit || (i === 0 && char === '-')) {
            if (numStartIndex === null) numStartIndex = i;
            if (i === input.length - 1) {
                extractNumber(input, numStartIndex, undefined, operands, char);            
            }
        } else {
            // operation symbol without number or parenthesis group before it
            if (numStartIndex === null && !gotParentheses)
                throw new SyntaxError(errorMessage);

            lastOperation = char;
            
            if (!gotParentheses) {
                extractNumber(input, numStartIndex, i, operands, char);
            }

            operations.push(char);
            numStartIndex = null;
        }

        gotParentheses = false;
        i++;
    }

    return [operands, operations];
}

/**
 * @param {[number]} operands ex.: [1, 2, 3, 4]
 * @param {[string]} operations ex.: ['+', '*', '/']
 * @returns {number} result of calculations
 */
function solveFlatExpression(operands, operations) {
    let len = operations.length;
    while(len > 0) {
        const nextOperationIndex = getNextOperationIndex(operations);
        [operands, operations] = doOperation(operands, operations, nextOperationIndex);
        len = operations.length;
    }
    return operands[0] || 0;
}

/** 
 * @param {[string]} operations 
 * @returns {number} index of the next operation to calculate in the operations array of expression
 */
function getNextOperationIndex(operations) {
    let result = 0, priority = OPERATIONS[operations[result]].priority;

    operations.forEach((operation, i) => {
        const op = OPERATIONS[operation];
        if (op.priority > priority) {
            result = i;
            priority = op.priority;
        }
    })
    return result;
}

/**
 * Performs a single calculation
 * @param {[number]} operands 
 * @param {[string]} operations 
 * @param {number} nextIndex 
 * @returns {[[number], [string]]} resulting operands and operations arrays after
 * single calculation
 */
function doOperation(operands, operations, nextIndex) {
    const newValue = OPERATIONS[operations[nextIndex]]
        .func(operands[nextIndex], operands[nextIndex + 1]);

    const newOperands = operands.slice(0, nextIndex)
        .concat([newValue], operands.slice(nextIndex + 2))
    
    const newOperations = operations.slice(0, nextIndex)
        .concat(operations.slice(nextIndex + 1));
    
    return [newOperands, newOperations];
}

function findClosingParenthese(str, openIndex) {
    let open = 1;
    for (let i = openIndex + 1; i < str.length; i++) {
        if (str[i] === '(')
            open++;
        if (str[i] === ')') {
            if (--open === 0) return i;
        }
    }
}

/**
 * @throws {SyntaxError} throws if given number substring cannot be casted to number  
 */
function extractNumber(input, from, to, arr, char) {
    const parsedNum = Number(input.slice(from, to));

    if (isNaN(parsedNum))
        throw new SyntaxError(`Syntax error near "${char}"`);
    
    arr.push(parsedNum);    
}

module.exports = {
    calculate,
    doOperation,
    solveFlatExpression,
    parse,
    getNextOperationIndex
};