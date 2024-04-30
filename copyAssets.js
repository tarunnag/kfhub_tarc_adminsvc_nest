// const fs = require('fs-extra');

// fs.copySync('src/modules/statistics/res', 'release/modules/statistics/res');

const fs = require('fs');
const path = require('path');

function copyDirSync(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    let entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        entry.isDirectory() ?
            copyDirSync(srcPath, destPath) :
            fs.copyFileSync(srcPath, destPath);
    }
}

// Specify the source and destination paths
const srcDir = path.join(__dirname, 'src/modules/statistics', 'res');
const destDir = path.join(__dirname, 'release/modules/statistics', 'res');

copyDirSync(srcDir, destDir);
