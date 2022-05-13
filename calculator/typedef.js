/** 
 * @typedef Operation
 * @property {string} type
 * @property {string} sign
 */
/**
 * @callback ParseFunction
 * @param {string} input
 * @returns {[[number], [Operation]]}
 */
/**
 * @callback ReplacerFunction
 * @param {string} expression ex.: "1+(2+3)"
 * @returns {string} flatten expression ex.: "1+4"
 */
/**
 * @callback SolverFunction
 * @param {[[number], [Operation]]}
 * @returns {number}
 */
/**
 * @callback CreateOperationFunction
 * @param {BINARY|UNARY} type 
 * @param {string} sign 
 * @returns {Operation}
 */
/**
 * @callback CalculateFunction
 * @throws {SyntaxError}
 * @param {string} input 
 * @returns {number} total result
 */
/**
 * @typedef operationsConfig
 * @property {object} UNARY_OPERATIONS
 * @property {object} BINARY_OPERATIONS
 */