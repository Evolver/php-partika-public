/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function( api ){
    
    var randomIdPref = '__rand';
    var randomIdOffset = 0;
    
    Object.defineProperties( String.prototype,
    {
        splitSelectors:
        {
            /**
             * Splits list of CSS selectors and returns an array
             * with every CSS selector found.
             * 
             * @return
             *  {Array}
             *  
             * @fixme
             *  splits incorrectly if comma present inside an attribute selector
             */
            value: function()
            {
                return this.split( "," ).map( function( selector ){
                    return selector.trim();
                });
            }
        },
        
        transformChildSelector:
        {
            /**
             * Adjusts single CSS selector to use element id instead of
             * child selector ">" notation.
             * 
             * @param elementId
             *  Element id to replace ">" with.
             *  
             * @return
             *  New CSS selector string.
             */
            value: function( elementId )
            {
                var ret;
                var selector = this.trim();
                
                if( elementId !== undefined )
                {
                    ret = '#' + elementId + ' ' + selector;
                }
                else
                {
                    if( selector[ 0 ] == '>' )
                    {
                        throw 'Child selectors for document as root are not supported';
                    }
                    
                    ret = selector;
                }
                
                return ret;
            }
        },
        
        transformChildSelectors:
        {
            /**
             * Transforms CSS selector string to use "#elementId >" syntax
             * instead of ">" syntax.
             * 
             * @param elementId
             *  Element id to use.
             *  
             * @return
             *  New CSS selector string.
             */
            value: function( elementId )
            {
                return this
                    .splitSelectors()
                    .map( function( selector ){
                        return selector.transformChildSelector( elementId );
                    })
                    .joinSelectors();
            }
        }
    });
    
    Object.defineProperties( Array.prototype,
    {
        joinSelectors:
        {
            /**
             * Joins multiple CSS selectors into a single CSS
             * selector string.
             * 
             * @returns
             *  Joined CSS selector string.
             */
            value: function()
            {
                return this.join( ',' );
            }
        }
    });
    
    /**
     * Generates random element id.
     * 
     * @returns
     *  {String}
     */
    function MakeRandomId()
    {
        return randomIdPref + ( ++randomIdOffset );
    };
    
    /**
     * Returns last generated random id.
     * 
     * @returns
     *  {String}
     */
    function LastRandomId()
    {
        return randomIdPref + randomIdOffset;
    };
    
    /**
     * Sets element id to a random one.
     * 
     * @param elem
     *  Element to set random id for.
     */
    function SetRandomId( elem )
    {
        var id = MakeRandomId();
        attr.set( elem, 'id', id );
        return id;
    };
    
    /**
     * Checks if specified element has an id that is the
     * same as the last one that was randomly generated.
     * 
     * @param elem
     *  Element to check.
     * 
     * @returns
     *  True if element is using the last generated random
     *  id. Returns false otherwise.
     */
    function HasLastRandomId( elem )
    {
        return ( GetId( elem ) === LastRandomId() );
    };
    
    /**
     * Returns element's id.
     * 
     * @param elem
     *  Element to return id for.
     * 
     * @param makeRandom
     *  Should random id be generated and set on
     *  the element if it does not have an id?
     * 
     * @returns
     *  Returns element's id if one is present. Returns
     *  undefined otherwise.
     */
    function GetId( elem, makeRandom )
    {
        var value = attr.get( elem, 'id' );
        
        if( value === undefined )
        {
            if( makeRandom === true )
            {
                return SetRandomId( elem );
            }
        }
        
        return value;
    };
    
    /**
     * Removes id attribute from the element.
     */
    function RemoveId( elem )
    {
        attr.remove( elem, 'id' );
    };
    
    /**
     * Executes CSS selector against the specified element
     *  and returns the elements matched.
     *  
     * @param selectors
     *  CSS selector string to match elements against.
     *  
     * @param elem
     *  Element in context of which to execute the selector.
     * 
     * @param fnName
     *  Name of native DOM function to use to execute the
     *  query selector.
     * 
     * @returns
     *  Whatever the native DOM function has returned. All null
     *  return values are returned as undefined.
     *  
     * @note
     *  This function heavily relies on context element's id.
     *  If context element is given and the element has no id,
     *  the id will be automatically generated and CSS selectors
     *  transformed to reference that ID. Afterwards, native
     *  browser querySelector*() APIs are used to query the
     *  elements.
     */
    function QuerySelector( selectors, elem, fnName )
    {
        var elemId;
        var elemIdWasGenerated;
        var parent;
        
        if( elem === undefined )
        {
            // no context given, use current document as context
            elemId = undefined;
            elemIdWasGenerated = false;
            parent = document;
        }
        else if( elem instanceof DocumentFragment )
        {
            // when document fragment is the context, then move
            // all contents to a temporary DIV so that we are able
            // to assign id to that div and transform the selector
            parent = elem.ownerDocument.createElement( 'div' );
            parent.appendChild( elem );
            
            var ret = QuerySelector( selectors, parent, fnName );
            
            // move elements back to the document fragment
            while( parent.firstChild )
            {
                elem.appendChild( parent.firstChild );
            }
            
            return ret;
        }
        else if( elem.parentNode === null )
        {
            // when an element without parent node is passed as
            // a context, then wrap that element with a document fragment
            // so that we can invoke native browser selector functions
            // against it
            parent = elem.ownerDocument.createDocumentFragment();
            parent.appendChild( elem );
            
            var ret = QuerySelector( selectors, elem, fnName );
            
            parent.removeChild( elem );
            
            return ret;
        }
        else
        {
            elemId = GetId( elem, true );
            elemIdWasGenerated = HasLastRandomId( elem );
            parent = elem.parentNode;
        }
        
        // Transform selectors so that all child selectors (the ones
        // that start with ">" end up having element's id in front
        // like this: "#elId >".
        var selectors = selectors.transformChildSelectors( elemId );
        
        // execute native browser APIs to obtain elements that match
        // the selector
        var ret = parent[ fnName ]( selectors );
        
        if( ( elem !== undefined ) && elemIdWasGenerated && ( GetId( elem ) === elemId ) )
        {
            // remove autogenerated id from the element
            RemoveId( elem );
        }
        
        if( ret === null )
        {
            ret = undefined;
        }
        
        return ret;
    };
    
    Object.defineProperties( api,
    {
        $:
        {
            /**
             * Selects first element that matches the specified CSS
             * selector.
             * 
             * @param selectors
             *  CSS selector string to match against.
             *  
             * @param context
             *  An element to execute the selector in context of.
             *  
             * @returns
             *  An element that has been found or undefined.
             */
            value: function( selectors, context )
            {
                return QuerySelector( selectors, context, 'querySelector' );
            }
        },
        
        $$:
        {
            /**
             * Selects all elements that match the specified CSS
             * selector.
             * 
             * @param selectors
             *  CSS selector string to match against.
             *  
             * @param context
             *  An element to execute the selector in context of.
             *  
             * @returns
             *  {Array}
             */
            value: function( selectors, context )
            {
                return Array.prototype.slice.call( QuerySelector( selectors, context, 'querySelectorAll' ) );
            }
        }
    });
    
    Object.defineProperties( Element.prototype,
    {
        $:
        {
            value: function( selectors )
            {
                return $( selectors, this );
            }
        },
        
        $$:
        {
            value: function( selectors )
            {
                return $$( selectors, this );
            }
        }
    });
    
})( window );