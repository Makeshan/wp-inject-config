module.exports = (properties, appendTag = false) => {
    let retVal = appendTag ? '<?php\n/**\n' : '/**\n';
    Object.keys(properties).map(key => retVal += ` * ${key}: ${properties[key]}\n`);
    return retVal + ' */';
};