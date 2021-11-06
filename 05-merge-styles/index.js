const fs = require('fs');
const path = require('path/posix');

const stylePath = path.join('05-merge-styles', 'styles')
const mergePath = path.join('05-merge-styles', 'project-dist', 'bundle.css')

async function mergeStyle() {
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
            fs.writeFile(mergePath, data.join(''), (err) => {
                if(err) throw err
            })
        }
    })
}

mergeStyle()
