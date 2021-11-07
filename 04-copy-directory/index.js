const fs = require('fs');
const path = require('path/posix');

const fsPromises = fs.promises

const sourceDirectory = path.join('04-copy-directory', 'files')
const targetDirectory = path.join('04-copy-directory','files-copy')

async function copyDir(sourceDirectory, targetDirectory) {
    fs.stat(targetDirectory, (err) => {
        if(!err) {
            rmFiles(targetDirectory).then(create())
        }
        else if(err.code === 'ENOENT')
            create()
    })

    async function rmFiles(targetDirectory) {
        let files = await fsPromises.readdir(targetDirectory, {withFileTypes:true})
        files.forEach(el => {
            if(el.isFile()) {
                fs.unlink(path.join(targetDirectory, el.name), (err) => {
                    if(err) throw err
                })
            }
            else {
                rmFiles(path.join(targetDirectory, el.name))
            }
        })
    }

    async function create() {
        fs.mkdir(targetDirectory, { recursive: true }, (err) => {
            if(err) throw err
            console.log('folder has been created')
        })
        
        fs.readdir(sourceDirectory, {withFileTypes: true}, (err, files) => {
            if(err) throw err 
            files.forEach(el => {
                fs.stat(path.join(sourceDirectory, el.name), (err, data) => {
                    if(!data.isDirectory()) {
                        fsPromises.copyFile(path.join(sourceDirectory, el.name), path.join(targetDirectory, el.name))
                    }
                    else {
                        fs.mkdir(path.join(targetDirectory, el.name), {recursive:true}, (err, data) => {
                            if(err) throw err
                        })
                        fs.readdir(path.join(sourceDirectory, el.name), (err, files) => {
                            if(err) throw err
                            files.forEach(item => 
                                fsPromises.copyFile(path.join(sourceDirectory, el.name, item), path.join(targetDirectory, el.name, item)))
                        })
                    }
                    console.log('Files copied')
                })
            })
        })
    }
}

copyDir(sourceDirectory, targetDirectory)







