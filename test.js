const assert = require('assert');

const {
    calculate,
    doOperation,
    solveFlatExpression,
    parse,
    getNextOperationIndex
} = require('./calculate-module');

suite('Tests set', function() {

    suite('Inner functions tests', function() {
        test('doOperation function', function() {
            // 1 + 3 * 4 - 2 * 6
            const exprArr = [1, 3, 4, 2, 6];
            const opsArr  = ['+', '*', '-', '*'];
            const [exprArr1, opsArr1] = doOperation(exprArr, opsArr, 1);
            assert.deepEqual(exprArr1, [1, 12, 2, 6], 'step 1');
            assert.deepEqual(opsArr1, ['+', '-', '*'], 'step 1');
            const [exprArr2, opsArr2] = doOperation(exprArr1, opsArr1, 2);
            assert.deepEqual(exprArr2, [1, 12, 12], 'step 2');
            assert.deepEqual(opsArr2, ['+', '-'], 'step 2');
            const [exprArr3, opsArr3] = doOperation(exprArr2, opsArr2, 0);
            assert.deepEqual(exprArr3, [13, 12], 'step 3');
            assert.deepEqual(opsArr3, ['-'], 'step 3');
            const [exprArr4, opsArr4] = doOperation(exprArr3, opsArr3, 0);
            assert.deepEqual(exprArr4, [1], 'step 4');
            assert.deepEqual(opsArr4, [], 'step 4');
        });

        test('getNextOperationIndex function', function() {
            assert.equal(getNextOperationIndex(['+', '*', '/']), 1);
            assert.equal(getNextOperationIndex(['+']), 0);
        })

        test('solveFlatExpression function', function() {
            assert.equal(
                solveFlatExpression(
                    [1, 3, 4, 2, 6], 
                    ['+', '*', '-', '*']
                ), 
                1
            );
            assert.equal(solveFlatExpression([42], []), 42);
            assert.equal(solveFlatExpression([-12, -5], ['-']), -7);
        })

        test('parse function', function() {
            const input = '1 + 3 * 4 - 2 *6';
            const exprArr = [1, 3, 4, 2, 6];
            const opsArr  = ['+', '*', '-', '*'];            
            const [exprArrResult, opsArrResult] = parse(input);
            assert.deepEqual(exprArrResult, exprArr);
            assert.deepEqual(opsArrResult, opsArr);

            const nested = '1 + ((5 + 1) * (3 - 1))';
            const exprN = [1, 12];
            const opsN = ['+'];
            const [exprNResult, opsNResult] = parse(nested);
            assert.deepEqual(exprNResult, exprN);
            assert.deepEqual(opsNResult, opsN);
        })
    })

    suite('General function test', function() {
        
        test('Normal data', function() {
            assert.equal(calculate(''), 0);
            assert.equal(calculate('1 + 2 + 3 + 4'), 10);
            assert.equal(calculate('1 + 2 * 3 / 4'), 2.5);
            assert.equal(calculate('1.5 * 2 + 3'), 6);
            assert.equal(calculate('5 * (2 + 3)'), 25);
            assert.equal(calculate('1 + ((5 + 1) * (3 - 1))'), 13);
            assert.equal(calculate('1'), 1);
            assert.equal(calculate('-1'), -1);
            assert.equal(calculate('5 * (-2)'), -10)
        })

        test('Incorrect data', function() {
            assert.throws(() => calculate('1 + ) - 5'))
            assert.throws(() => calculate('1 + (5 * 6'))
            assert.throws(() => calculate('1 +* 5'))
            assert.throws(() => calculate('*1 - 5'))
            assert.throws(() => calculate('1.5.5 + 2'))
        })

    })

})