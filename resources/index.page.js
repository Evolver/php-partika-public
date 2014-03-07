/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function( app )
{
    document.ready( function()
    {
        var categoryElems = $$( 'body > article > .categories > .list > .category' );
        var productElems = $$( 'body > article > .categories > .list > .category > .products > .product' );
        var cartElem = $( 'body > header > .cart' );
        
        app.order.InitCategories( categoryElems );
        app.order.InitProducts( productElems );
        app.order.InitCart( cartElem );
        
        events.bind( cartElem, 'proceed', function()
        {
            app.order.UpdateServer(
            {
                on:
                {
                    success: function()
                    {
                        location.assign( app.GetURI( 'Review.xhtml' ) );
                    }
                }
            });
        });
        
        events.bind( cartElem, 'clear', function()
        {
            app.order.UpdateServer();
        });
    });
    
})( window.app );