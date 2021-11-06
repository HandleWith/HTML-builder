const fs = require('fs');
const path = require('path/posix');
const readline = require('readline')

const rl = readline.createInterface(
    process.stdin, process.stdout);

fs.open(path.join('02-write-file', 'text.txt'), 'w', (err) => {
    if(err) throw err
})    

rl.setPrompt('Enter you data:\n') 
rl.prompt()
rl.on('SIGINT', () => {
    rl.close()
    console.log('See you soon')
})
rl.on('line', (data) => {
    if(data === 'exit') {
        rl.close()
        console.log('See you soon')
    }
    else {
        fs.appendFile(path.join('02-write-file', 'text.txt'), data+'\n', (err) => {
            if(err) throw err
            console.log('File has been changed')
        })
    }
})



