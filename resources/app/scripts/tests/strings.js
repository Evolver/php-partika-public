/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function()
{
    // String.prototype.toFormattedNumberString()
    (function()
    {
        console.assert( ( '0' ).toFormattedNumberString() === '0' );
        console.assert( ( '0.00' ).toFormattedNumberString() === '0.00' );
        console.assert( ( '0.1' ).toFormattedNumberString() === '0.1' );
        console.assert( ( '0.01' ).toFormattedNumberString() === '0.01' );
        console.assert( ( '0.001' ).toFormattedNumberString() === '0.001' );
        console.assert( ( '0.0001' ).toFormattedNumberString() === '0.0001' );
        console.assert( ( '1.0001' ).toFormattedNumberString() === '1.0001' );
        console.assert( ( '10.0001' ).toFormattedNumberString() === '10.0001' );
        console.assert( ( '100.0001' ).toFormattedNumberString() === '100.0001' );
        console.assert( ( '1000.0001' ).toFormattedNumberString() === '1,000.0001' );
        console.assert( ( '10000.0001' ).toFormattedNumberString() === '10,000.0001' );
        console.assert( ( '100000.0001' ).toFormattedNumberString() === '100,000.0001' );
        console.assert( ( '1000000.0001' ).toFormattedNumberString() === '1,000,000.0001' );
        
        console.assert( ( '0' ).toFormattedNumberString( ',', ' ' ) === '0' );
        console.assert( ( '0.00' ).toFormattedNumberString( ',', ' ' ) === '0,00' );
        console.assert( ( '0.1' ).toFormattedNumberString( ',', ' ' ) === '0,1' );
        console.assert( ( '0.01' ).toFormattedNumberString( ',', ' ' ) === '0,01' );
        console.assert( ( '0.001' ).toFormattedNumberString( ',', ' ' ) === '0,001' );
        console.assert( ( '0.0001' ).toFormattedNumberString( ',', ' ' ) === '0,0001' );
        console.assert( ( '1.0001' ).toFormattedNumberString( ',', ' ' ) === '1,0001' );
        console.assert( ( '10.0001' ).toFormattedNumberString( ',', ' ' ) === '10,0001' );
        console.assert( ( '100.0001' ).toFormattedNumberString( ',', ' ' ) === '100,0001' );
        console.assert( ( '1000.0001' ).toFormattedNumberString( ',', ' ' ) === '1 000,0001' );
        console.assert( ( '10000.0001' ).toFormattedNumberString( ',', ' ' ) === '10 000,0001' );
        console.assert( ( '100000.0001' ).toFormattedNumberString( ',', ' ' ) === '100 000,0001' );
        console.assert( ( '1000000.0001' ).toFormattedNumberString( ',', ' ' ) === '1 000 000,0001' );
        
    })();
    
})();