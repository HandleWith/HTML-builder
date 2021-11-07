const fs = require('fs');
const path = require('path/posix');

const fsPromises = fs.promises

async function createDirectory() {
    fs.mkdir(path.join('06-build-page', 'project-dist'), {recursive:true}, (err) => {
        if(err) throw err
    })
    fs.writeFile(path.join('06-build-page', 'project-dist', 'index.html'), 'w', (err) => {
        if(err) throw err
    })
    fs.writeFile(path.join('06-build-page', 'project-dist', 'style.css'), 'w', (err) => {
        if(err) throw err
    })
}

createDirectory()

async function createPairs() {
    let obj = {}
    let files = await fsPromises.readdir(path.join('06-build-page', 'components'), {withFileTypes: true})
    let truefiles = files.filter(el => el.isFile() && path.extname(el.name) === '.html')
    truefiles.forEach(el => {
        fs.readFile(path.join('06-build-page', 'components', el.name), 'utf-8', (err, data) => {
            if(err) throw err
            obj[`{{${el.name.substring(0, el.name.indexOf('.'))}}}`] = data
            createHTML(obj)
        })
    })
}

createPairs()

async function createHTML(pairs) {
    let readStream = fs.createReadStream(path.join('06-build-page', 'template.html'), 'utf-8')
    let writeStream = fs.createWriteStream(path.join('06-build-page', 'project-dist','index.html'))
    
   readStream.on('data', (chunks) => {
      for(let i = 0; i<Object.keys(pairs).length; i++) {
        chunks = chunks.toString().replace(Object.keys(pairs)[i], pairs[Object.keys(pairs)[i]])
      }
      writeStream.write(chunks)
   })
}

const stylePath = path.join('06-build-page', 'styles')
const mergePath = path.join('06-build-page', 'project-dist', 'style.css')
const targetDirectory = path.join('06-build-page', 'project-dist', 'assets')
const sourceDirectory = path.join('06-build-page', 'assets')

async function mergeStyle(stylePath, mergePath) {
    fs.readdir(stylePath, {withFileTypes: true}, (err, data) => {
        let result = []
        if(err) throw err
        let styles = data.filter(el => path.extname(el.name) === '.css' && el.isFile())
        console.log(data.name)
        styles.forEach(el => 
            fs.readFile(path.join(stylePath, el.name), 'utf-8', (err, data) => {
                if(err) throw err
                result.push(data)
                createFile(result)
            }))
        async function createFile(data) {
            fs.stat(mergePath, (err) => {
                if(!err) {
                    rmFile().then(
                        fs.writeFile(mergePath, data.join('\n'), (err) => {
                            if(err) throw err
                        })
                    )
                }
                else if(err.code === 'ENOENT')
                    fs.writeFile(mergePath, data.join(''), (err) => {
                        if(err) throw err
                    })
            })
        }
        async function rmFile() {
            fs.writeFile(mergePath, '', (err) => {
                if(err) throw err
            })
        }
    })
}

mergeStyle(stylePath, mergePath)

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