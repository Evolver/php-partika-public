/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function( api )
{
    var exposedAPI =
    {
        /**
         * Returns value of an attribute stored on an
         * element.
         * 
         * @param elem
         *  Element to lookup attribute value on.
         * 
         * @param name
         *  Name of attribute to lookup.
         * 
         * @returns
         *  Attribute's value or undefined.
         */
        get: function( elem, name )
        {
            var node = elem.getAttributeNode( name );
            
            if( node === null )
            {
                return undefined;
            }
            
            return node.value;
        },
        
        /**
         * Sets value of an attribute.
         * 
         * @param elem
         *  Element to set an attribute on.
         *  
         * @param name
         *  Name of attribute to set.
         *  
         * @param value
         *  Value of attribute to set.
         */
        set: function( elem, name, value )
        {
            elem.setAttribute( name, value );
        },
        
        /**
         * Checks if element has an attribute set.
         * 
         * @param elem
         *  Element to check.
         *  
         * @param name
         *  Name of attribute to check.
         *  
         * @returns
         *  True if attribute is set. False otherwise.
         */
        has: function( elem, name )
        {
            return elem.hasAttribute( name );
        },
        
        /**
         * Removes attribute from an element.
         * 
         * @param elem
         *  Element to remove attribute from.
         * 
         * @param name
         *  Name of attribute to remove.
         */
        remove: function( elem, name )
        {
            elem.removeAttribute( name );
        },
        
        /**
         * Copies all attributes from elem to target.
         * 
         * @param elem
         *  Source element.
         * 
         * @param target
         *  Target element.
         */
        copy: function( elem, target )
        {
            return target.copyAttributes( elem );
        }
    };
    
    Object.defineProperty( api, 'attr',
    {
        value: exposedAPI
    });
    
    Object.seal( exposedAPI );
    
})( window );