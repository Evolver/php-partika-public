/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

Object.defineProperties( Function.prototype,
{
    /**
     * Flag, indicating whether the function is derivable.
     * 
     * @note
     *  All functions are derivable by default.
     */
    derivable:
    {
        writeable: true,
        value: true
    },
    
    /**
     * Creates a new function object which has the prototype
     * of the current (derivable) function in its prototype chain.
     * 
     * @param details
     *  Function initialization description object.
     * 
     * @todo Derivation based on Object.defineProperty().
     */
    derive:
    {
        value: function( details )
        {
            if( !this.derivable )
            {
                console.error( 'Attempt to derive from non-derivable ' + this );
                return undefined;
            }
            
            var parent = this;
            
            var derived = function()
            {
            };
            derived.prototype = parent.prototype;
            
            var child;
            var proto = new derived;
            
            if( details !== undefined && details.constr !== undefined )
            {
                child = function()
                {
                    return details.constr.apply( this, arguments );
                };
            }
            else
            {
                child = function()
                {
                };
            }
            
            if( details !== undefined && details.proto !== undefined )
            {
                details.proto( proto, parent.prototype );
            }
            
            Object.defineProperty( proto, 'constructor',
            {
                value: child
            });
            
            child.prototype = proto;
            return child;
        }
    },
    
    /**
     * Same as call(), except the call is delayed until current batch is over.
     */
    callLater:
    {
        value: function()
        {
            var fn = this;
            var args = arguments;
            
            setTimeout( function()
            {
                fn.call.apply( fn, args );
            },
            0 );
        }
    },
    
    /**
     * Same as apply(), except the call is delayed until current batch is over.
     */
    applyLater:
    {
        value: function()
        {
            var fn = this;
            var args = arguments;
            
            setTimeout( function()
            {
                fn.apply.apply( fn, args );
            },
            0 );
        }
    },
    
    /**
     * Checks whether current function is a constructor of the specified value.
     * 
     * @param val
     *  Value to check constructor of.
     *  
     * @return
     *  Boolean
     */
    isConstructorOf:
    {
        value: function( val )
        {
            if( val === undefined )
            {
                return false;
            }
            
            return ( val.constructor === this );
        }
    }
});