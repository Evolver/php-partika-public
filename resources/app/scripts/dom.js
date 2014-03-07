/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function( api )
{
    
    /**
     * Initializes script elements present in container so that when contents
     * of the container are inserted into document, the scripts get evaluated.
     * 
     * @param Element container
     */
    function InitScripts( container )
    {
        // If any script elements have been included, re-create them as
        // fresh nodes so that they are evaluated when added to document.
        // By default, browsers will not evaluate script tags imported via
        // .innerHTML.
        $$( 'script', container ).forEach( function( script )
        {
            var newScript = document.createElement( 'script' );
            
            attr.copy( script, newScript );

            if( script.innerHTML )
            {
                newScript.innerHTML = script.innerHTML;
            }
            
            script.swapWithNode( newScript );
        });
    };
    
    // Used by ConvertMarkupToFragment()
    var markupDiv;
    
    /**
     * Returns document fragment which contains markup in parsed form.
     * Any script tags contained within will be evaluated when inserted into document.
     * 
     * @return HTMLDocumentFragment
     */
    function ConvertMarkupToFragment( markup )
    {
        if( markupDiv === undefined )
        {
            markupDiv = document.createElement( 'div' );
        }
        
        // Let browser convert markup to DOM for us
        markupDiv.innerHTML = markup;
        
        // Move elements from div to document fragment
        var frag = document.createDocumentFragment();
        
        while( markupDiv.firstChild )
        {
            frag.appendChild( markupDiv.firstChild );
        }
        
        return frag;
    };
    
    /**
     * Expose custom event API to the "outside world".
     */
    var exposedAPI =
    {
        parse: ConvertMarkupToFragment,
        initScripts: InitScripts
    };
    
    Object.seal( exposedAPI );
    
    Object.defineProperty( api, 'dom', {
        value: exposedAPI
    });
    
})( window );