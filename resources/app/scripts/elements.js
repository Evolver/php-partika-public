/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

Object.defineProperties( Element.prototype,
{
    repaint:
    {
        /**
         * Some browsers won't repaint element when their attributes change.
         * This is the case if CSS attribute selectors present in the page.
         * Calling this method will force repaint of the element.
         */
        value: function()
        {
            if( !( 'ownerDocument' in this ) )
            {
                // Do not repaint elements with no owner document.
                return;
            }
            
            if( !this.ownerDocument.contains( this ) )
            {
                // Do not repaint elements that are not inserted into
                // the document.
            }
            
            if( !( 'className' in this ) )
            {
                // Do not repaint elements that have no class attribute
                return;
            }
            
            this.className = this.className;
        }
    },
    
    copyAttributes:
    {
        /**
         * Copies all attributes from source element.
         * 
         * @param source
         *  Source element.
         */
        value: function( source )
        {
            var target = this;
            
            Array.prototype.forEach.call( source.attributes, function( att )
            {
                target.setAttributeNS( att.namespaceURI, att.name, att.value );
            });
        }
    },
    
    removeChildNodes:
    {
        /**
         * Removes all child nodes from an element.
         */
        value: function()
        {
            while( this.lastChild )
            {
                this.removeChild( this.lastChild );
            }
        }
    },
    
    removeFromParent:
    {
        /**
         * Removes element from parent node.
         */
        value: function()
        {
            if( this.parentNode === null )
            {
                return;
            }
            
            this.parentNode.removeChild( this );
        }
    },
    
    swapWithNode:
    {
        /**
         * Replaces current element with target element in the parent node's context.
         */
        value: function( target )
        {
            this.parentNode.insertBefore( target, this );
            this.removeFromParent();
        }
    }
});

(function()
{
    /**
     * Automatically repaint an element when one of the listed functions
     * is invoked.
     */
    var autoRepaint = [ 'setAttribute', 'setAttributeNS',
                        'setAttributeNode', 'setAttributeNodeNS',
                        'removeAttribute', 'removeAttributeNode', 'removeAttributeNS' ];
    
    for( var fnName in autoRepaint )
    {
        var old = Element.prototype[ fnName ];
        
        Object.defineProperty( Element.prototype, fnName,
        {
            /**
             * Invokes the original method, calls repaint() and returns the
             * returned value.
             */
            value: function()
            {
                var ret = old.apply( this, arguments );
                this.repaint();
                return ret;
            }
        });
    }
    
})();