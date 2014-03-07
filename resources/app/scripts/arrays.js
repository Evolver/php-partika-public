/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

if( !( 'forEach' in Array.prototype ) )
{
    Object.defineProperty( Array.prototype, 'forEach',
    {
        /**
         * Implemented according to
         * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach
         * 
         * @param callback
         *  Callback to execute for every element.
         *  
         * @param thisArg
         *  Value of "this" argument to pass to the callback.
         */
        value: function( callback, thisArg )
        {
            var copy = this.slice();
            
            for( var i = 0; i < copy.length; ++i )
            {
                callback.call( thisArg, copy[ i ], i, this );
            }
        }
    });
}