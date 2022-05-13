const operationsConfig = require('./config/operations.js');
const calculate = require('./calculator/index.js')(operationsConfig);

process.stdin.setEncoding('utf8');

function ask() {
    process.stdout.write('\u001b[1mEnter expression:\u001b[22m ');
    process.stdin.resume();
}

process.stdin.on('data', function(data) {
    process.stdin.pause();
    try {
        const result = calculate(data);
        process.stdout.write('\n\u001b[32mResult: ' + result + '\u001b[39m');
    } catch(e) {
        process.stdout.write('\n\u001b[31m' + e.message + '\u001b[39m');
    } finally {
        console.log('\n');
        ask();
    }
})

ask();
