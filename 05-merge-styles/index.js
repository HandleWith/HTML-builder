const fs = require('fs');
const path = require('path/posix');

const stylePath = path.join('05-merge-styles', 'styles')
const mergePath = path.join('05-merge-styles', 'project-dist', 'bundle.css')

async function mergeStyle(stylePath, mergePath) {
    fs.readdir(stylePath, {withFileTypes: true}, (err, data) => {
        let result = []
        if(err) throw err
        let styles = data.filter(el => path.extname(el.name) === '.css' && el.isFile())
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