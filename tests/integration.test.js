const assert = require('assert');

const operationsConfig = require('../config/operations.js');
const calculate = require('../calculator/index.js')(operationsConfig);

describe('Integration tests', function() {

    describe('Calculations tests', function() {
        
        it('Normal data', function() {
            assert.equal(calculate(''), 0);
            assert.equal(calculate('1 + 2 + 3 + 4'), 10);
            assert.equal(calculate('1 + 2 * 3 / 4'), 2.5);
            assert.equal(calculate('1.5 * 2 + 3'), 6);
            assert.equal(calculate('5 * (2 + 3)'), 25);
            assert.equal(calculate('1 + ((5 + 1) * (3 - 1))'), 13);
            assert.equal(calculate('1'), 1);
            assert.equal(calculate('-1'), -1);
            assert.equal(calculate('5 * (-2)'), -10);
            assert.equal(calculate('2(3+4)'), 14);
            assert.equal(calculate('(3+4)2'), 14);
            assert.equal(calculate('(3+2)(2+1)'), 15);
            assert.equal(calculate('-(3+2)*(2+1)'), -15);
        })

        it('Incorrect data', function() {
            assert.throws(() => calculate('1 + ) - 5'))
            assert.throws(() => calculate('1 + (5 * 6'))
            assert.throws(() => calculate('1 +* 5'))
            assert.throws(() => calculate('*1 - 5'))
            assert.throws(() => calculate('1.5.5 + 2'))
        })

    })

})