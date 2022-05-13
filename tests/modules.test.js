const assert = require('assert');
const mockFunctionCall = require('./mock-function-call.js');

const { UNARY, BINARY } = require('../calculator/constants.js');
const operationsConfig = require('../config/operations.js');

const createOperation = require('../calculator/create-operation.js')(operationsConfig);

const { makeParse } = require('../calculator/parse.js');
const makeSolve = require('../calculator/perform-maths.js');

const { 
    stripSpaces, 
    makeReplacer 
} = require('../calculator/input-transformations.js');

suite('Modules tests', function() {

    suite('parse function', function() {
        // Testing function
        const parseFlatExpression = makeParse(operationsConfig);

        test('only binary', function() {
            const input = '1+3*4-2*6';
            const expressionExpected = [1, 3, 4, 2, 6];
            const operationsExpected  = [
                createOperation(BINARY, '+'),
                createOperation(BINARY, '*'), 
                createOperation(BINARY, '-'), 
                createOperation(BINARY, '*')
            ];            
            const [expressionResult, operationsResult] = parseFlatExpression(input);
            assert.deepEqual(expressionResult, expressionExpected);
            assert.deepEqual(operationsResult, operationsExpected);
        })

        test('with unary', function() {
            const input = '-1+-3*4';
            const expressionExpected = [1, 3, 4];
            const operationsExpected  = [
                createOperation(UNARY, '-' ),
                createOperation(BINARY, '+' ),
                createOperation(UNARY, '-' ),
                createOperation(BINARY, '*' ), 
            ];            
            const [expressionResult, operationsResult] = parseFlatExpression(input);
            assert.deepEqual(expressionResult, expressionExpected);
            assert.deepEqual(operationsResult, operationsExpected);
        })
    })

    suite('input-transformations', function() {
        
        suite('stripSpaces', function() {
            test('stripSpaces', function() {
                const input = '3 + (4 -  2)';
                const output = stripSpaces(input);
                assert.doesNotMatch(output, /\s/g);
            })
        })

        suite('replaceParenthesesByValues', function() {
            
            test('One parentheses', function() {
                const input = '3+(2+1)';
                const expected = '3+3';

                // Testing function
                const replaceParenthesesByValues = makeReplacer(
                    mockFunctionCall([[2, 1], [createOperation(BINARY, '+' )]]),
                    mockFunctionCall([3])
                );
                const flatted = replaceParenthesesByValues(input);

                assert.equal(flatted, expected);
            })
            
            test('two parentheses', function() {
                const str = '2*(1+2)+3+(3-2)';
                const expected = '2*3+3+1';

                const parseMock = mockFunctionCall([
                    [[3, 2], [createOperation(BINARY, '-')]],
                    [[1, 2], [createOperation(BINARY, '+')]]
                ])
                const solveMock = mockFunctionCall([1, 3]);

                // Testing function
                const replaceParenthesesByValues = 
                    makeReplacer(
                        parseMock,
                        solveMock
                    );

                const flatted = replaceParenthesesByValues(str);

                assert.equal(flatted, expected);
        
            })

            test('nested parentheses', function() {
                const str = '2*(2*(1+3))+5/(3/2)';
                const expected = '2*8+5/1.5';

                const parseMock = mockFunctionCall([
                    [[3, 2], [createOperation(BINARY, '/')]],
                    [[1, 3], [createOperation(BINARY, '+')]],
                    [[2, 4], [createOperation(BINARY, '*')]]
                ])
                const solveMock = mockFunctionCall([1.5, 4, 8])

                // Testing function
                const replaceParenthesesByValues = 
                    makeReplacer(
                        parseMock,
                        solveMock
                    );
                
                const flatted = replaceParenthesesByValues(str);

                assert.equal(flatted, expected);
            })
        })
    })

    suite('perform-maths', function() {
        const solveParsedExpression = makeSolve(operationsConfig);
        
        test('solveParsedExpression function', function() {
            assert.equal(
                solveParsedExpression(
                    [1, 3, 4, 2, 6], 
                    [
                        createOperation(BINARY, '+'), 
                        createOperation(BINARY, '*'), 
                        createOperation(BINARY, '-'), 
                        createOperation(BINARY, '*')
                    ]
                ), 
                1
            );
            assert.equal(solveParsedExpression([42], []), 42);
            assert.equal(
                solveParsedExpression(
                    [-12, -5], 
                    [createOperation(BINARY, '-')]
                ), 
                -7
            );
        })
    })

})
