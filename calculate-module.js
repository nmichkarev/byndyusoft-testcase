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
        gotOperation   = false,
        gotNumber      = false,
        gotParentheses = false, 
        i = 0;

    input = input.replace(/\s/g, '');
    const lastIndex = input.length - 1; 

    while(i <= lastIndex) {

        const char         = input[i];
        const minusFirst   = i === 0 && char === '-';
        const isOperation  = char in OPERATIONS && !(minusFirst);
        const isDigit      = /\d|\./.test(char) || minusFirst;
        const isParenthese = char === '(';
        const errorMessage = `Syntax error near "${char}"`;
        
        // incorrect symbol
        if (!isDigit && !isOperation && !isParenthese)
            throw new SyntaxError(errorMessage)

        // start of the number
        if (isDigit && numStartIndex === null) {
            numStartIndex = i;
        }

        // end of the number
        if ((!isDigit || isDigit && i === lastIndex) && numStartIndex !== null) {
            operands.push(extractNumber(
                input, 
                numStartIndex, 
                i === lastIndex ? i + 1 : i
            ));

            numStartIndex = null;

            // if there were parentheses before number without operation "(b+c)a"
            if (gotParentheses) {
                operations.push('*');
            }

            gotNumber = true;
        }
        
        if (isOperation) {
            if (gotOperation || !gotNumber && !gotParentheses)
                throw new SyntaxError(errorMessage)
            operations.push(char);
        }

        if (isParenthese) {
            const closingPar = findClosingParenthese(input, i);

            // "(" without ")"
            if (!closingPar) throw new SyntaxError(errorMessage);
            
            operands.push(
                calculate(input.slice(i + 1, closingPar))
            );

            // if "a(b+c)"
            if (!gotOperation && i !== 0) operations.push('*');

            i = closingPar + 1; // jump to the end of parentheses
            
        } else {
            i++;
        }

        gotNumber      = gotParentheses || gotOperation ? false : gotNumber;
        gotOperation   = isOperation;
        gotParentheses = isParenthese;

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
        [operands, operations] = doOperation(
            operands, 
            operations, 
            nextOperationIndex
        );
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
 function extractNumber(input, from, to) {
    const parsedNum = Number(input.slice(from, to));

    if (isNaN(parsedNum))
        throw new SyntaxError(`Syntax error near "${input[from]}"`);
    
    return parsedNum;    
}

module.exports = {
    calculate,
    doOperation,
    solveFlatExpression,
    parse,
    getNextOperationIndex
};