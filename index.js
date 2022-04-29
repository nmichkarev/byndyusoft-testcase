const { calculate } = require('./functions');

process.stdin.setEncoding('utf8');

function ask() {
    process.stdout.write('\033[1mEnter expression:\033[22m ');
    process.stdin.resume();
}

process.stdin.on('data', function(data) {
    process.stdin.pause();
    try {
        const result = calculate(data);
        process.stdout.write('\n\033[32mResult: ' + result + '\033[39m');
    } catch(e) {
        process.stdout.write('\n\033[31m' + e.message + '\033[39m');
    } finally {
        console.log('\n');
        ask();
    }
})

ask();
