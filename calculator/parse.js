require('./typedef.js');
const { 
    UNARY, 
    BINARY 
} = require('./constants.js');
const makeCreateOperation = require('./create-operation.js');

/**
 * @param {operationsConfig}
 * @returns {ParseFunction}
 */
function makeParse(operationsConfig) {
    const { BINARY_OPERATIONS, UNARY_OPERATIONS } = operationsConfig
    const createOperation = makeCreateOperation(operationsConfig);
    /**
     * Extracts numbers and math operations chars to separate arrays.
     * @param {string} input 
     * @returns {[[number], [Operation]]}
     */
    return function parseFlatExpression(input) {
        const operands     = [];
        const operations   = [];
        let numStartIndex  = null,
            gotOperation   = false,
            gotNumber      = false,
            i = 0;

        const lastIndex = input.length - 1; 

        while(i <= lastIndex) {

            const char         = input[i];
            const isOperation  = char in BINARY_OPERATIONS || char in UNARY_OPERATIONS;
            const isDigit      = /\d|\./.test(char);
            const errorMessage = `Syntax error near "${char}"`;
            
            // incorrect symbol
            if (!isDigit && !isOperation)
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
                gotNumber = true;
            }
            
            if (isOperation) {
                
                if (!gotNumber && !(char in UNARY_OPERATIONS))
                    throw new SyntaxError(errorMessage)
                
                operations.push(createOperation(
                    gotNumber ? BINARY : UNARY,
                    char
                ));
            }
            

            gotOperation   = isOperation;
            gotNumber      = gotOperation ? false : gotNumber;

            i++;
        }

        return [operands, operations];
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

/**
 * @param {string} input 
 * @returns {number} index
 */
function findLastOpenParenthese(input) {
    const openIndex = input
        .split('')
        .reverse()
        .findIndex(c => c === '(');

    return openIndex === -1 ? null : input.length - openIndex - 1;
}

/**
 * @param {string} str 
 * @param {number} openIndex 
 * @returns {number} index
 */
function findMatchingCloseParenthese(str, openIndex) {
    const closeIndex = str
        .slice(openIndex)
        .split('')
        .findIndex(c => c === ')');

    return closeIndex === -1 ? null : openIndex + closeIndex;
}

module.exports = { 
    makeParse, 
    findLastOpenParenthese, 
    findMatchingCloseParenthese 
};