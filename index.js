const embedInterface = require('./commentEmbedInterface');
const configInterface = require('./configInterface');
const commentParser = require('./commentParser');

const injectConfig = (packageObject, filePath) => {
    const props = configInterface.buildProperties(packageObject, configInterface.getContext(filePath));
    embedInterface.replaceBlock(filePath, props);
    console.log('Inject script run\nFile ' + filePath + ' has following properties:');
    console.log(commentParser.parseByRow(commentParser.parseHeader(filePath)));
};

module.exports = {
    injectConfig
};



