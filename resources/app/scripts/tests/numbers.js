/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function()
{
    // Number.prototype.sign
    (function()
    {
        var signed = -1;
        var unsigned = 1;
        var zero = 0;
        
        console.assert( signed.sign === -1 );
        console.assert( unsigned.sign === 1 );
        console.assert( zero.sign === 0 );
        
    })();
    
    // Number.prototype.abs
    (function()
    {
        var signed = -1;
        var unsigned = 1;
        var zero = 0;
        
        console.assert( signed.abs === 1 );
        console.assert( unsigned.abs === 1 );
        console.assert( zero.abs === 0 );
        
    })();
    
})();