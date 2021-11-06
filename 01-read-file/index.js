const fs = require('fs');
const path = require('path/posix');

let stream = fs.createReadStream(path.join('01-read-file', 'text.txt'), 'utf-8')

stream.on('data', (chunks) => {
    console.log(chunks)
})