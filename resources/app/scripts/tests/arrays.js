/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function()
{
    // Array.prototype.forEach()
    (function()
    {
        var arr = [ 1, 2, 3, 4 ];
        var res = [];
        
        arr.forEach( function( el, idx, origArr )
        {
            console.assert( this !== arr );
            console.assert( origArr === arr );
            console.assert( idx == res.length );
            
            res.push( el );
            origArr.push( el );
        });
        
        console.assert( res.length == 4 );
        console.assert( res[ 0 ] === 1 );
        console.assert( res[ 1 ] === 2 );
        console.assert( res[ 2 ] === 3 );
        console.assert( res[ 3 ] === 4 );
        
        console.assert( arr.length == 8 );
        console.assert( arr[ 0 ] === 1 );
        console.assert( arr[ 1 ] === 2 );
        console.assert( arr[ 2 ] === 3 );
        console.assert( arr[ 3 ] === 4 );
        console.assert( arr[ 4 ] === 1 );
        console.assert( arr[ 5 ] === 2 );
        console.assert( arr[ 6 ] === 3 );
        console.assert( arr[ 7 ] === 4 );
        
    })();
    
})();