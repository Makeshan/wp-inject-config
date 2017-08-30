const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');

chai.use(require('chai-diff'));

const cw = require('../commentWrapper');
const cp = require('../commentParser');
const ci = require('../configInterface');
const ce = require('../commentEmbedInterface');

it('Should wrap passed values with comment', () => {
    const testProperties = {
        "Plugin Name": "Test theme",
        "Version": "1.0",
        "Author": "Ann Doe",
        "License": "GNU General Public License v2 or later",
        "License URI": "http://www.gnu.org/licenses/gpl-2.0.html",
        "Text Domain": "testplugindomain"
    };
    const expectedValue = fs.readFileSync('./test/expected/wrap-in-comments.txt', 'utf-8');
    expect(cw(testProperties)).to.equal(expectedValue);
});

it('Should properly retrieve plugin header block', () => {
    const parseHeader = cp.parseHeader;
    const expectedValue = fs.readFileSync('./test/expected/plain-header.txt', 'utf-8');
    expect(parseHeader('./test/source/plugin-getmeta-test.php')).to.equal(expectedValue);
});

it('Should parse row to property', () => {
    const parseRow = cp.parseRow;
    expect(parseRow('/**')).to.equal(false);
    expect(parseRow(' * Theme Name: Test plugin')).to.deep.equal({"Theme Name": "Test plugin"});
    expect(parseRow(' * Version: 1.0')).to.deep.equal({"Version": "1.0"});
    expect(parseRow('Version: 1.0  \n')).to.deep.equal({"Version": "1.0"});
    expect(parseRow(' Version:1.0')).to.deep.equal({"Version": "1.0"});
    expect(parseRow(' ! Version: 1.0')).to.equal(false);
});

it('Should parse comment block to object', () => {
    const parseByRow = cp.parseByRow;
    const expectedValue = {
        "Plugin Name": "Test theme",
        "Version": "1.0",
        "Author": "Ann Doe",
        "License": "GNU General Public License v2 or later",
        "License URI": "http://www.gnu.org/licenses/gpl-2.0.html",
        "Text Domain": "testplugindomain"
    };
    const plainHeader = fs.readFileSync('./test/expected/plain-header.txt', 'utf-8');
    expect(parseByRow(plainHeader)).to.deep.equal(expectedValue);
});


it('Should properly translate package config names to WordPress names', () => {
    expect(ci.translateToContext('name')).to.equal('Plugin Name');
    expect(ci.translateToContext('name', 'theme')).to.equal('Theme Name');
    expect(ci.translateToContext('Theme Name', 'theme', 'toPackage')).to.equal('name');
    expect(ci.translateToContext('Plugin Name', 'plugin', 'toPackage')).to.equal('name');
    expect(ci.translateToContext('Property that is not defined', 'plugin', 'toPackage')).to.equal('Property that is not defined');
    expect(ci.translateToContext('version')).to.equal('Version');
    expect(ci.translateToContext('keywords')).to.equal('Tags');

});

it('Should operate on different contexts', () => {
    const expectedValue = require('./expected/prepared-package-theme.json');

    expect(ci.buildProperties(require('./source/package.json'), 'theme')).to.deep.equal(expectedValue);
});


it('Should properly translate properties from package.json to WordPress header properties', () => {
    expect(ci.prepareValues('keywords',['testTag1','testTag2','testTag3'])).to.equal('testTag1, testTag2, testTag3');
    expect(ci.prepareValues('name','Example Plugin Name')).to.equal('Example Plugin Name');
});


it('Should properly embed header inside existing php file', () => {
    const testProperties = require('./source/prepared-package-plugin.json');
    const filePath = './test/plugin-embed-test-temp.php';
    const expectedFile = fs.readFileSync('./test/expected/plugin-embed-test.php', 'utf-8');
    fs.writeFileSync(filePath, fs.readFileSync('./test/source/plugin-embed-test.php'));
    ce.replaceBlock(filePath, testProperties);
    const createdFile = fs.readFileSync(filePath, 'utf-8');
    expect(createdFile).not.to.be.differentFrom(expectedFile, {showSpace: true, relaxedSpace: true});
    after(() => fs.unlinkSync(filePath));
});

it('Creates a new file if the one specified by path is nonexistent', () => {
    const testProperties = require('./source/prepared-package-plugin.json');
    const filePath = './test/plugin-create-inject-temp.php';
    const expectedFile = fs.readFileSync('./test/expected/plugin-create-inject.php', 'utf-8');
    ce.replaceBlock(filePath, testProperties);
    const createdFile = fs.readFileSync(filePath, 'utf-8');
    expect(createdFile).not.to.be.differentFrom(expectedFile, {showSpace: true, relaxedSpace: true});
    after(() => fs.unlinkSync(filePath));
});

it('Should determine context from file extension', () => {
    expect(ci.getContext('./plugins/example-plugin/example-plugin.php')).to.equal('plugin');
    expect(ci.getContext('./themes/example-theme/style.css')).to.equal('theme');
});
