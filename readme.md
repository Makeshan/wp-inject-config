##### Create and update WordPress plugin/theme header from package.json

The goal of this package is to help applying DRY principle to WordPress plugin and theme
development process by injecting package.json properties to your extension's file headers.
This is especially useful when you often change plugin/theme version for deployment,
but can be used inject any property.

#### Important notice
This package can erase existing plugin header. Additionally, while WordPress allows,
for example, to define plugin name and version in separate comments, this package assumes you are using a PHPDoc
DocBlock style of headers.
###### Example
```php
/**
 * Plugin Name: The Plugin 
 * Version: 0.0.1
 * Text Domain: plugindomain
 */
```   
## Installation
`npm install wp-inject-config --save-dev`
## Usage
#### Basic
This setup is assuming that you are using [npm scripts](https://docs.npmjs.com/misc/scripts) to run a js file inside your `./scripts` directory. You need to provide a path to your main plugin file (`functions.php`, `my-plugin-name.php`) or theme `styles.css`.
You must also pass package.json object of your current project (actually, any JS object with desired properties).
```javascript
const wpic = require('wp-inject-config');
const pj = require('./../package.json');
wpic.injectConfig(pj, './plugins/my-plugin/functions.php');
```
#### Custom properties
You can also add properties that are used by WordPress, but are normally absent in package.json. Append 
`wp-inject-config` object to your package attributes like so:
```json
{
  "wp-inject-config": {
    "properties": {
      "Theme URI": "http://wordpress.org/themes/twentythirteen",
      "Text Domain": "textdomain"
    }
  } 
}
```

## Roadmap
This module is currently under development so that it can work under more sophisticated build scenarios.
Upcoming changes will include:

* Gulp wrapper
* More useful error messages
* Soft inject (leaving unknow properties in header unchanged - this is my priority now).
* Possibility to exclude unwanted package.json attributes
* Documentation of a module with JSDoc
