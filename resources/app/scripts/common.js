/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function( api )
{
    var config = {};
    
    Object.defineProperties( config,
    {
        xmlns:
        {
            get: function()
            {
                return document.documentElement.getAttribute( 'xmlns:app' );
            }
        },
        
        baseURI:
        {
            get: function()
            {
                return document.documentElement.getAttributeNS( config.xmlns, 'baseURI' );
            }
        }
    });
    
    var app = {};
    var appLoadingLevel = 0;
    
    Object.defineProperties( app,
    {
        config:
        {
            value: config
        },
        
        // Crafts URI suitable for XHR.
        GetURI:
        {
            value: function( path )
            {
                return config.baseURI + '/' + path;
            }
        },
        
        // Controls UI's loading state. If loading, then class "loading" will
        // be present on the documentElement. If not loading, the class is
        // absent. Use CSS to change UI when document is in loading state.
        loading:
        {
            get: function()
            {
                return ( appLoadingLevel > 0 );
            },
            
            set: function( value )
            {
                if( value )
                {
                    ++appLoadingLevel;
                    
                    if( appLoadingLevel == 1 )
                    {
                        document.documentElement.classList.add( 'loading' );
                    }
                }
                else
                {
                    console.assert( appLoadingLevel > 0 );
                    --appLoadingLevel;
                    
                    if( appLoadingLevel == 0 )
                    {
                        document.documentElement.classList.remove( 'loading' );
                    }
                }
            }
        }
    });
    
    api.app = app;
    
    api.onbeforeunload = function()
    {
        app.loading = true;
    };
    
})( window );