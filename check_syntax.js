const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.expo') {
                arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
            }
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const files = getAllFiles('.');
files.forEach(file => {
    try {
        const code = fs.readFileSync(file, 'utf8');
        parse(code, {
            sourceType: 'module',
            plugins: ['jsx'],
        });
    } catch (e) {
        console.log(`Syntax error in ${file}: ${e.message}`);
    }
});
