<?php
/**
 * Plugin Name: Test theme
 * Version: 1.0
 * Author: Ann Doe
 * License: GNU General Public License v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: testplugindomain
 */

/**
 * This is test function block
 * @return bool
 */
function wp_code_inject_testfunction(){
    return false;
}
add_action('init', 'wp_code_inject_testfunction');