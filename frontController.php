<?php
/**
 * @author Dmitry Stepanov <dmitry@stepanov.lv>
 * @copyright 2013, Dmitry Stepanov. All rights reserved.
 * @link http://stepanov.lv
 */

use \Exception;
use \Core\Core;
use \Core\Regex;
use \Core\Input\String;
use \RTK\Application;
use \RTK\Response\XHTML as XHTMLResponse;
use \RTK\Response\Text as TextResponse;

/* @var $app Application */
$app = require_once( __DIR__ .'/.bootstrap.php' );

$notFound = $app->cfg->notFoundRequest;

try
{
    $req = String::Validate( $_GET[ 'page' ], '', array
    (
        'min' => 1,
        'max' => 1024
    ));

    if( $req == '' )
    {
        $path = null;
        $format = null;
    }
    else
    {
        $requestRegex = '/^(?<path>' . Regex::$pathComponents . ')(?:\\.(?<format>' . Regex::$pathExt . '))?$/';

        if( !Regex::Match( $requestRegex, $req, $parts ) )
        {
            Core::Fail( 'Malformed request ' . var_export( $req, true ) );
        }

        $path = $parts[ 'path' ];

        if( array_key_exists( 'format', $parts ) )
        {
            $format = $parts[ 'format' ];
        }
        else
        {
            $format = null;
        }
    }
}
catch( Exception $e )
{
    $path = $notFound;
}

$app->Process( $path, $format );
