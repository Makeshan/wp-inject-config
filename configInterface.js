const path = require('path');

const propRelations = {
    theme: {
        name: "Theme Name"
    },
    plugin: {
        name: "Plugin Name"
    },
    common: {
        version: "Version",
        description: "Description",
        keywords: "Tags",
        author: "Author",
        license: "License"
    }
};

function prepareValues(propertyKey, propertyValue) {
    let strat = {};
    const stratName = propertyKey + 'Prepare';

    strat.keywordsPrepare = () => {
        return propertyValue.join(', ');
    };
    strat.defaultPrepare = () => {
        return propertyValue;
    };

    return (strat[stratName] instanceof Function) ? strat[stratName]() : strat.defaultPrepare();
}

const getContext = (filepath) => {
    const contexts = {
        php: 'plugin',
        css: 'theme'
    };
    const ext = path.extname(filepath).replace('.', '');
    return contexts[ext];
};

const flattenProps = (context = 'plugin') => {
    return Object.assign({}, propRelations[context], propRelations['common']);
};

const getAdditionalProps = (pj) => {
    return pj['wp-code-inject'] && pj['wp-code-inject']['properties'] ? pj['wp-code-inject']['properties'] : {};
};

const translateToContext = (property, context = 'plugin', direction = 'toExtension') => {
    const propsFlat = flattenProps(context);
    if (direction === 'toPackage') {
        return Object.keys(propsFlat).find(key => propsFlat[key] === property) || property;
    }
    return propsFlat[property] || property;
};

/**
 * @function getIntersection
 * @author enigma-io
 * @link https://github.com/enigma-io/boundless
 */
function getIntersection(obj1, obj2) {
    return Object.keys(obj2).reduce((childProps, key) => {
        if (key in obj1) {
            childProps[key] = obj1[key];
        }
        return childProps;
    }, {});
}

const buildProperties = (pj, context = 'plugin') => {
    const props = Object.assign({}, getIntersection(pj, flattenProps(context)), getAdditionalProps(pj));
    const propsNew = {};
    for (let oldProp in props) {
        if (props.hasOwnProperty(oldProp)) {
            propsNew[translateToContext(oldProp, context)] = prepareValues(oldProp, props[oldProp]);
        }
    }
    return propsNew;
};

module.exports = {
    translateToContext,
    buildProperties,
    prepareValues,
    getContext
};


