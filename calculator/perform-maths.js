require('./typedef.js');
const { UNARY, BINARY } = require('./constants.js');

/**
 * @param {operationsConfig}
 * @returns {SolverFunction}
 */
function makeSolve({ UNARY_OPERATIONS, BINARY_OPERATIONS }) {
    /**
     * @param {[number]} operands
     * @param {[Operation]} operations
     * @returns {number} result of calculations
     */
    return function solveParsedExpression(operands, operations) {
        let len = operations.length;
        while(len > 0) {
            const nextOperationIndex = getNextOperationIndex(operations, BINARY_OPERATIONS);
            [operands, operations] = doOperation(
                operands, 
                operations, 
                nextOperationIndex,
                UNARY_OPERATIONS,
                BINARY_OPERATIONS
            );
            len = operations.length;
        }
        return operands[0] || 0;
    }
}


/** 
 * @param {[Operation]} operations 
 * @param {object}
 * @returns {number} index of the next operation to calculate in the operations array of expression
 */
 function getNextOperationIndex(operations, BINARY_OPERATIONS) {
    
    for (let i = operations.length - 1; i >= 0; i--) {
        if (operations[i].type === UNARY) 
            return i;
    }

    let result   = 0;
    let priority = BINARY_OPERATIONS[operations[result].sign].priority;

    operations.forEach((o, i) => {
        const operation = BINARY_OPERATIONS[o.sign];
        if (operation.priority > priority) {
            result = i;
            priority = operation.priority;
        }
    })

    return result;
}

/**
 * Performs a single calculation
 * @param {[number]} operands 
 * @param {[Operation]} operations 
 * @param {number} nextIndex 
 * @param {object}
 * @param {object}
 * @returns {[[number], [Operation]]} resulting operands and operations arrays after
 * single calculation
 */
 function doOperation(operands, operations, operationIndex, UNARY_OPERATIONS, BINARY_OPERATIONS) {
    const operation = operations[operationIndex];
    const opType    = operation.type;
    const sign      = operation.sign;

    const operandIndex = findOperandIndexForOperation(opType, operationIndex,
        operations);

    const newValue = (opType === UNARY ? UNARY_OPERATIONS : BINARY_OPERATIONS)
        [sign]
        .func(operands[operandIndex], operands[operandIndex + 1]);

    const newOperands = [].concat(
        operands.slice(0, operandIndex),
        [newValue],
        operands.slice(operandIndex + (opType === UNARY ? 1 : 2))
    )

    const newOperations = [].concat(
        operations.slice(0, operationIndex),
        operations.slice(operationIndex + 1)
    )
    
    return [newOperands, newOperations];
}

function findOperandIndexForOperation(operationType, operationIndex, operations) {
    let operandIndex = operationIndex;
    
    if (operationType === UNARY) {
        operandIndex = 0;
        for (let i = 0; i <= operationIndex; i++) { 
            if (operations[i].type === BINARY) ++operandIndex;
        }
    }

    return operandIndex;
}

module.exports = makeSolve;