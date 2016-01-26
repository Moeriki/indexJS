// node

var fs = require('fs');
var path = require('path');

// private functions

/**
 * Import a module by referencing its absolute file path. If the file path is a directory the import is delegated to
 * #importModuleDirectoryByIndexFile. If the file is not readable, or it is not a JS or JSON file, it returns null.
 * @param  {string} filePath absolute file path
 * @return {*}
 */
function importModule(filePath) {
    var fileStat, extname;

    try {
        fileStat = fs.statSync(filePath);
    } catch (e) {
        process.stderr.write(filePath + ' is not readable, check CHMOD permissions');
        return null;
    }

    if (fileStat.isDirectory()) {
        return importModuleDirectoryByIndexFile(filePath);
    }

    extname = path.extname(filePath);
    if (extname !== '.js' && extname !== '.json') {
        return null;
    }

    return require(filePath);
}

/**
 * Import a directory by looking for an index.js file in it. If not found delegate import to #importModuleDirectory.
 * @param  {string} dirPath absolute path to a directory
 * @return {*}
 */
function importModuleDirectoryByIndexFile(dirPath) {
    var dirIndexFile = path.join(dirPath, 'index.js');

    try {
        fs.statSync(dirIndexFile);
        return require(dirIndexFile);
    } catch (e) {
        // directory has no index file
        return importModuleDirectoryByListing(dirPath);
    }
}

/**
 * Import a directory as a commonJS module by importing all its containing JS and JSON files.
 * @param  {string} dirPath absolute file path to a directory
 * @return {object}
 */
function importModuleDirectoryByListing(dirPath) {
    var fileList;

    try {
        fileList = fs.readdirSync(dirPath);
    } catch (e) {
        throw e;
        // throw new Error('indexJS could not read directory');
    }

    return fileList.reduce(function (directoryModule, relativefilePath) {
        var moduleName = relativefilePath.split(path.sep).pop().split('.')[0];
        var module = importModule(path.join(dirPath, relativefilePath));

        if (module) {
            directoryModule[moduleName] = module;
        }

        return directoryModule;
    }, {});
}

// module exports

module.exports = function (dirPath) {
    var absDirPath = path.isAbsolute(dirPath) ?
        dirPath :
        path.join(process.cwd(), dirPath);

    return importModuleDirectoryByListing(absDirPath);
};
