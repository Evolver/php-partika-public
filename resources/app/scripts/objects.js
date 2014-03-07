/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

// initialize all function objects with non-clonable flag
Object.defineProperty( Function.prototype, 'clonable',
{
    writable: true,
    value: false
});

// list of objects that are clonable by default
Object.clonable = true;
Array.clonable = true;
String.clonable = true;
Number.clonable = true;
Boolean.clonable = true;

Object.defineProperties( Object.prototype,
{
    clonable:
    {
        /**
         * Returns true if the object can be cloned.
         */
        get: function()
        {
            return this.constructor.clonable;
        }
    },
    
    clone:
    {
        /**
         * Clones (duplicates) the object and returns an identical one.
         * 
         * @param deep
         *  Whether to perform "deep clone" (i.e. clone all properties
         *  as well).
         * 
         * @returns
         *  An instance of the same type of the object with all its
         *  properties having the same value.
         */
        value: function( deep )
        {
            if( !this.clonable )
            {
                console.error( 'Attempt to clone a non-clonable ' + this );
                return undefined;
            }
            
            if( deep === undefined )
            {
                deep = false;
            }
            
            if( this.constructor === String )
            {
                return this.valueOf();
            }
            else if( this.constructor === Number )
            {
                return this.valueOf();
            }
            else if( this.constructor === Boolean )
            {
                return this.valueOf();
            }
            else if( this.constructor === Array )
            {
                return this.slice( 0, this.length );
            }
            else
            {
                var clone = function(){};
                clone.prototype = this.prototype;
                
                return ( new clone ).writeProps( this, deep );
            }
        }
    },
    
    deepClone:
    {
        /**
         * An alias of clone() with "deep" argument set to true.
         */
        value: function()
        {
            return this.clone( true );
        }
    },
    
    writeProps:
    {
        /**
         * Copies properties from "src" to current object.
         * 
         * @param src
         *  Source object to copy properties from.
         *  
         * @param deep
         *  If set to true, then all properties are cloned as well.
         *  
         * @return
         *  Current object.
         */
        value: function( src, deep )
        {
            if( deep === undefined )
            {
                deep = false;
            }
            
            for( var k in src )
            {
                if( !src.hasOwnProperty( k ) )
                {
                    continue;
                }
                
                var propVal = src[ k ];
                var assignVal;
                
                if( deep && ( propVal instanceof Object ) && propVal.clonable )
                {
                    assignVal = propVal.deepClone();
                }
                else
                {
                    assignVal = propVal;
                }
                
                this[ k ] = assignVal;
            }
            
            return this;
        }
    },
    
    deepWrite:
    {
        /**
         * Alias for write() with "deep" argument set to true.
         */
        value: function( src )
        {
            return this.writeProps( src, true );
        }
    },
    
    mergeProps:
    {
        /**
         * Creates new pure object with the same properties
         * as current object and write()s additional properties
         * from "obj".
         * 
         * @param obj
         *  Object to write additional properties from.
         *  
         * @returns
         *  A new instance of merged version of the object.
         */
        value: function( obj )
        {
            return ({}).writeProps( this ).writeProps( obj );
        }
    },
    
    deepMerge:
    {
        /**
         * Creates clone of current object and deepWrite()s
         * additional properties from "obj".
         * 
         * @param obj
         *  Object to write additional properties from.
         *  
         * @returns
         *  New instance of pure object that represents the
         *  merged properties.
         */
        value: function( obj )
        {
            return ({}).deepWrite( this ).deepWrite( obj );
        }
    },
    
    hasOwnProperties:
    {
        /**
         * Returns true if current object has own properties.
         */
        value: function()
        {
            for( var k in this )
            {
                if( this.hasOwnProperty( k ) )
                {
                    return true;
                }
            }
            
            return false;
        }
    },
    
    proxy:
    {
        /**
         * Creates a proxy object that fully resembles the API
         * and behavior of current object.
         * 
         * @param protoFn
         *  Prototype initialization function.
         *  
         * @returns
         *  An object that has current object in its prototype
         *  chain.
         */
        value: function( protoFn )
        {
            var proto = function ProxiedPrototype(){};
            proto.prototype = this;
            
            var proxy = function ProxiedObject(){};
            proxy.prototype = new proto;
            proxy.constructor = this.constructor;
            
            if( protoFn !== undefined )
            {
                protoFn( proxy.prototype, this );
            }
            
            return new proxy;
        }
    },
    
    writeSkel:
    {
        /**
         * Copies property structure from "src" to current object, descending
         * into objects stored in "src". This function is similar to writeProps(),
         * except it won't overwrite current object's property if "src" stores object
         * with the same property name. The objects will be merged (properties joined)
         * instead. All other properties are simply copied.
         * 
         * @param src
         *  Source object to copy properties from.
         *  
         * @return
         *  Current object.
         */
        value: function( src )
        {
            // Only regular objects can be used to join their property structure
            console.assert( Object.isConstructorOf( this ) );
            console.assert( Object.isConstructorOf( src ) );
            
            for( var k in src )
            {
                if( !src.hasOwnProperty( k ) )
                {
                    continue;
                }
                
                var curVal = this[ k ];
                var newVal = src[ k ];
                var assignVal;
                
                if( Object.isConstructorOf( newVal ) )
                {
                    if( Object.isConstructorOf( curVal ) )
                    {
                        curVal.writeSkel( newVal );
                        continue;
                    }
                }
                
                this[ k ] = newVal;
            }
            
            return this;
        }
    },
    
    mergeSkel:
    {
        /**
         * Copies property structure from "src" to a cloned version of object, descending
         * into objects stored in "src". This function is similar to writeProps(),
         * except it won't overwrite current object's property if "src" stores object
         * with the same property name. The objects will be merged (properties joined)
         * instead. All other properties are simply copied.
         * 
         * @param src
         *  Source object to copy properties from.
         *  
         * @return
         *  Cloned current object with merged property structure from src.
         */
        value: function( src )
        {
            return this.deepClone().writeSkel( src );
        }
    },
    
    deepMergeSkel:
    {
        /**
         * Same as mergeSkel(), except "src" is deep-cloned before merging its property structure.
         */
        value: function( src )
        {
            return this.mergeSkel( src.deepClone() );
        }
    }
});