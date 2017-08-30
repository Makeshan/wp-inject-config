const fs = require('fs');
const commentWrapper = require('./commentWrapper');
const commentParser = require('./commentParser');
const configInterface = require('./configInterface');

const createFileWithBlock = (filePath, properties) => {
    const appendTag = (configInterface.getContext(filePath) === 'plugin');
    fs.writeFileSync(filePath, commentWrapper(properties, appendTag));
};

const replaceExistingBlock = (filePath, properties) => {
    commentParser.replaceHeader(filePath, commentWrapper(properties));
};

const replaceBlock = (filePath, properties) => {
    if(fs.existsSync(filePath)){
        replaceExistingBlock(filePath, properties);
    }
    else{
        createFileWithBlock(filePath, properties);
    }
};

module.exports = {
    replaceBlock
};