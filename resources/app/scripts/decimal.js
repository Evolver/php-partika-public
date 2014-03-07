/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

if( Big === undefined )
{
    throw 'big.js (dependency) is missing';
}

var Decimal = Big;

Object.defineProperties( Decimal.prototype,
{
    toCurrencyString:
    {
        value: function()
        {
            var ret = this.toFixed( 2 ).toString().toFormattedNumberString( ',', ' ' );
            
            if( ret.substr( -3 ) == ',00' )
            {
                ret = ret.substr( 0, ret.length - 3 ) + ',-';
            }
            
            return ret;
        }
    },
    
    toFormattedNumberString:
    {
        value: function()
        {
            return this.toString().toFormattedNumberString( ',', ' ' );
        }
    }
});