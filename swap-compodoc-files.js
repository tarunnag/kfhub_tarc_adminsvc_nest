const fs = require('fs-extra');
const path = require('path');

const sourceFolder = './coverage';
const preTarget = "./documentation";
const preTargetJestHtml = "./documentation/coverage/jest-html-reporters-attach";
const targetFolder = './documentation/coverage';

const jestHtmlReporters = './jest-html-reporters-attach';
const destTargetJestHtml = "./documentation/jest-html-reporters-attach";

const files = [
    { folder :'./temp', fileName: 'index.js', destinationFolder: './node_modules/@compodoc/compodoc/dist' }, 
    { folder :'./temp', fileName: 'unit-test-report.hbs', destinationFolder: './node_modules/@compodoc/compodoc/src/templates/partials' },
    { folder :'./temp', fileName: 'overview.hbs', destinationFolder: './node_modules/@compodoc/compodoc/src/templates/partials' },
    { folder :'', fileName: 'jest_html_reporters.html', destinationFolder: './documentation' }
];

async function copyFileToDestination(file) {
    const sourceFilePath = path.join(file.folder, file.fileName);
    const destinationFilePath = path.join(file.destinationFolder, file.fileName);
    await fs.ensureDir(preTarget);

    fs.copyFile(sourceFilePath, destinationFilePath, err => {
        if (err) {
            console.error(`Error occurred while copying ${file.fileName}:`, err);
            return;
        }
        console.log(`File ${file.fileName} has been copied and overwritten in ${file.destinationFolder}.`);
    });
}

async function copyFolder(source, target) {
    try {
        await fs.ensureDir(preTargetJestHtml);
      await fs.ensureDir(target);
      await fs.copy(source, target);
      console.log(`Folder '${source}' and its contents copied to '${target}'.`);
    } catch (err) {
      console.error(`Error copying folder: ${err}`);
    }
  }

files.forEach(copyFileToDestination);
copyFolder(sourceFolder, targetFolder);
copyFolder(jestHtmlReporters, destTargetJestHtml);
console.log(`Folder '${sourceFolder}' copied to '${targetFolder}'.`);