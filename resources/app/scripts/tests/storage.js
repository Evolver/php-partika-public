/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function()
{
    // sessionStorage
    (function()
    {
        console.assert( 'sessionStorage' in window );
        
        var randomKey = Math.random().toString();
        console.assert( sessionStorage.getItem( randomKey ) === null );
        
        sessionStorage.setItem( randomKey, randomKey );
        console.assert( sessionStorage.getItem( randomKey ) === randomKey );
        
        sessionStorage.removeItem( randomKey );
        console.assert( sessionStorage.getItem( randomKey ) === null );
    });
    
    // localStorage
    (function()
    {
        console.assert( 'localStorage' in window );
        
        var randomKey = Math.random().toString();
        console.assert( localStorage.getItem( randomKey ) === null );
        
        localStorage.setItem( randomKey, randomKey );
        console.assert( localStorage.getItem( randomKey ) === randomKey );
        
        localStorage.removeItem( randomKey );
        console.assert( localStorage.getItem( randomKey ) === null );
    });
    
})();