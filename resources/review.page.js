/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function( app )
{
    document.ready( function()
    {
        var productElems = $$( 'body > article > .products > .product' );
        var cartElem = $( 'body > header > .cart' );
        
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
                        location.assign( app.GetURI( 'Order.xhtml' ) );
                    }
                }
            });
        });
    });
    
})( window.app );