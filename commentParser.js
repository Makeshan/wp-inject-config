const fs = require('fs');

const parseHeader = (file) => {
    const reg = new RegExp(/(\/\*\*[\s\S]*?\*\/)/g);
    const readBuffer = Buffer.alloc(8192);
    const fd = fs.openSync(file, 'r');
    fs.readSync(fd,readBuffer, 0, 8192, 0);
    return readBuffer.toString().match(reg)[0];
};

const replaceHeader = (file, replacement) =>{
    fs.writeFileSync(file, fs.readFileSync(file, 'utf-8').replace(/(\/\*\*[\s\S]*?\*\/)/, replacement));
};

const parseRow = (rowString) => {
    const reg = new RegExp(/^[ *]*([a-zA-Z ]*):[ ]*(.*[\S])/);
    const matches = rowString.match(reg);
    return matches ? {[matches[1]]: matches[2]} : false;
};


const parseByRow = (commentBlock) => {
    let properties = {};
    const linesArray = commentBlock.split(/(\r\n|\r|\n)/);
    for(let line of linesArray){
        let parsed = parseRow(line);
        if(parsed){
            properties[Object.keys(parsed)[0]] = parsed[Object.keys(parsed)[0]];
        }

    }
    return properties;
};

module.exports = {
    parseHeader,
    parseRow,
    parseByRow,
    replaceHeader
};

