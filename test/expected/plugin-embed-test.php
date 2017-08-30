<?php
/**
 * Plugin Name: test-plugin
 * Version: 0.0.1
 * Description: This is the description for the test plugin
 * Author: Ann Doe
 * Tags: test-tags, test-tags-2, test-tags-3
 * License: MIT
 */

/**
 * This is test function block
 * @return bool
 */
function wp_code_inject_testfunction(){
    return false;
}
add_action('init', 'wp_code_inject_testfunction');