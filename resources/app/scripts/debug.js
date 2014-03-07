/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

if( console === undefined )
{
    // Create dummy console object
    console = {};
}

if( console.log === undefined )
{
    console.log = function(){};
}

if( console.error === undefined )
{
    console.error = function(){};
}

if( console.assert === undefined )
{
    console.log( 'console.assert() not defined. Using custom implementation.' );
    
    console.assert = function( expr, message )
    {
        if( !expr )
        {
            if( message === undefined )
            {
                message = 'Assertion failed';
            }
            else
            {
                message = ( 'Assertion failed: ' + message );
            }
            
            console.error( message );
            throw message;
        }
    };
}

// override console.assert() so that alert box is displayed
(function()
{
    var orig = console.assert;
    console.assert = function( expr, message )
    {
        if( !expr )
        {
            alert( 'An assertion has failed. See debug console for more details.' );
        }
        
        /**
         * IE9 is breaks down when calling apply() on console's members. As a workaround
         * we test for presence of apply(). If not present, just throw.
         */
        if( orig.apply !== undefined )
        {
            orig.apply( console, arguments );
        }
        else
        {
            console.log( 'Browser incapable of apply()ing calls to console.assert(). Throwing instead.' );
            throw 'Assertion failed';
        }
    };
})();

// override window.onerror
(function()
{
    var old = window.onerror;
    window.onerror = function( message, url, lineNr )
    {
        console.log( 'Error "' + message + '" at ' + url + ':' + lineNr );
        
        if( old !== null )
        {
            return old.apply( this, arguments );
        }
        else
        {
            return true;
        }
    };
})();