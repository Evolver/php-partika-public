/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

Object.defineProperties( Number.prototype,
{
    sign:
    {
        get: function()
        {
            var val = this.valueOf();
            
            if( val == 0 )
            {
                return 0;
            }
            else if( val < 0 )
            {
                return -1;
            }
            else
            {
                return 1;
            }
        }
    },
    
    abs:
    {
        get: function()
        {
            return Math.abs( this.valueOf() );
        }
    }
});