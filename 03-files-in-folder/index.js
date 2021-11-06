const fs = require('fs');
const path = require('path/posix');

fs.readdir(path.join('03-files-in-folder', 'secret-folder'), {withFileTypes: true}, (err, files) => {
    if(err) throw err
    let trueFiles = files.filter(el => el.isFile())
    trueFiles.forEach(el => 
        fs.stat(path.join('03-files-in-folder', 'secret-folder', el.name), (err, data) => {
            if(err) throw err
            const name = el.name.substring(0, el.name.indexOf('.'))
            const extension = el.name.substring(el.name.indexOf('.')+1, el.name.length)
            const size = data.size + ' b'
            console.log(`${name} - ${extension} - ${size}`)
        }))
})
