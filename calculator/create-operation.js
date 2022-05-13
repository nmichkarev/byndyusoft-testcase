require("./typedef.js");
const { UNARY, BINARY } = require("./constants.js");

/**
 * @param {operationsConfig}
 * @returns {CreateOperationFunction}
 */
const makeCreateOperation = ({ UNARY_OPERATIONS, BINARY_OPERATIONS }) => (type, sign) => {
    if (
        type !== UNARY && type !== BINARY ||
        type === UNARY && !UNARY_OPERATIONS.hasOwnProperty(sign) ||
        type === BINARY && !BINARY_OPERATIONS.hasOwnProperty(sign)
    ) {
        throw new Error('Unsupported operation ' + sign);
    }

    return { type, sign };
}

module.exports = makeCreateOperation;