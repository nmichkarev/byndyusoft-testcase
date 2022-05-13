require('./typedef.js');
const { 
    findLastOpenParenthese, 
    findMatchingCloseParenthese 
} = require('./parse.js');

/**
 * @param {string} input 
 * @returns {string}
 */
function stripSpaces(input) {
    return input.replace(/\s/g, '');
}

/**
 * Injects parse function
 * @param {ParseFunction} parse
 * @param {SolverFunction} solve
 * @returns {ReplacerFunction}
 */
function makeReplacer(parse, solve) {
    /**
     * Replaces subexpressions in parentheses by computed value
     * @param {string} input
     * @returns {string}
     */
    return function(input) {
        let openIndex = findLastOpenParenthese(input);
        
        while (openIndex !== null) {
            const closeIndex = findMatchingCloseParenthese(input, openIndex);
            
            if (closeIndex === null)
                throw new SyntaxError(`Syntax error near (`);
            
            const parseResult = parse(
                input.slice(openIndex + 1, closeIndex)
            );
            const solved = solve(...parseResult);
            
            input = replaceParenthesesByNumber(input, openIndex, closeIndex, solved);

            openIndex = findLastOpenParenthese(input);
        }

        return input; 
    }
}


/**
 * @param {string} input 
 * @param {number} openIndex 
 * @param {number} closeIndex 
 * @param {number} computed 
 * @returns {string}
 */
function replaceParenthesesByNumber(input, openIndex, closeIndex, computed) {
    const prevIsNumber  = /\d|\./.test(input[openIndex - 1]);
    const afterInNumber = /\d|\./.test(input[closeIndex + 1]);
    
    return input.slice(0, openIndex)
        + (prevIsNumber ? '*' : '')
        + computed 
        + (afterInNumber ? '*' : '')
        + input.slice(closeIndex + 1);
}

module.exports = {
    makeReplacer,
    stripSpaces
};
