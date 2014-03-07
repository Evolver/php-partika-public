<?php
/**
 * @author Dmitry Stepanov <dmitry@stepanov.lv>
 * @copyright 2013, Dmitry Stepanov. All rights reserved.
 * @link http://stepanov.lv
 */

use \Core\Core;
use \RTK\Config;
use \RTK\Application;
use \RTK\Session;

/**
 * Absolute path to directory where Core files are located.
 */
$coreRoot = '/var/www/html/stepanov/site/core';

/**
 * Absolute path to directory where framework files are located.
 */
$frameworkRoot = '/var/www/html/stepanov/site/framework';

/**
 * Absolute path to directory where application system files are located.
 */
$appRoot = '/var/www/html/stepanov/site/partika';

require_once( $coreRoot . '/bootstrap.php' );
require_once( $frameworkRoot . '/bootstrap.php' );
require_once( $appRoot . '/bootstrap.php' );

// Flip to false when in production
Core::$debug = false;

$cfg = new Config;
$cfg->systemRoot = $appRoot;
$cfg->publicRoot = __DIR__;
$cfg->session = new Session;
$cfg->method = $_SERVER['REQUEST_METHOD' ];
$cfg->args = $_REQUEST;

return new Application( $cfg );
