/**
 * Creates function that will return all given values one by one
 * @param {[any]} answers 
 * @returns {Function}
 */
function mockFunctionCall(answers) {
    const mocksGenerator = (function*() { yield* answers })();
    return function() { return mocksGenerator.next().value }
}

module.exports = mockFunctionCall;
