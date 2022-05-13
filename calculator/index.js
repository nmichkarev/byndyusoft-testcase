const { makeParse } = require('./parse.js');
const makeSolve = require('./perform-maths.js');
const { 
    stripSpaces, 
    makeReplacer
} = require('./input-transformations.js');

/**
 * @param {operationsConfig}
 * @returns {CalculateFunction}
 */
function calculator(operationsConfig) {
    const parseFunction   = makeParse(operationsConfig);
    const solveFunction   = makeSolve(operationsConfig);
    const replaceFunction = makeReplacer(parseFunction, solveFunction);
    /**
     * @type {CalculateFunction}
     */
    return function calculate(input = '') {
        const flattedInput = replaceFunction(stripSpaces(input));
        const parseResult = parseFunction(flattedInput);
        return solveFunction(...parseResult);
    }
}

module.exports = calculator;