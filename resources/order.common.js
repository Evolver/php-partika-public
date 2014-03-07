/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function( app )
{
    var Category = app.products.Category;
    var Product = app.products.Product;
    var ProductOrder = app.products.ProductOrder;
    var Cart = app.products.Cart;
    
    var selectedCategory;
    var cart = new Cart;
    
    function InitCategories( categoryElems )
    {
        var titleElem = $( 'body > header > .title' );
        
        categoryElems.forEach( function( categoryElem )
        {
            var category = new Category( categoryElem );
            
            if( category.isSelected )
            {
                SelectCategory( category );
            }
            
            events.bind( categoryElem, [ 'click', 'touchend' ], function( evt )
            {
                evt.preventDefault();
                
                if( category.isSelected )
                {
                    return;
                }
                
                SelectCategory( category );
                
                // The call is delayed because otherwise some mobile browsers
                // won't animate the scrolling well.
                scrolling.scrollIntoView
                (
                    categoryElem,
                    {
                        // Make sure we scroll a bit up so that fixed title
                        // element does not cover product list
                        marginTop: ( -1 * titleElem.scrollHeight )
                    }
                );
            });
            
            // Prevent selection of text
            events.bind( categoryElem, 'mousedown', function( evt )
            {
                evt.preventDefault();
            });
        });
    };
    
    function InitProducts( productElems )
    {
        productElems.forEach( function( productElem )
        {
            var product = new Product( productElem );
            
            var incrementButton = productElem.$( '> .order > .tools > .inc' );
            var decrementButton = productElem.$( '> .order > .tools > .dec' );
            var currentQuantity = productElem.$( '> .order > .volume > .current > .qty' );
            var currentQuantitySuffix = productElem.$( '> .order > .volume > .current > .suffix' );
            var currentPriceTotal = productElem.$( '> .order > .total > .amount > .value' );
            
            InitView();
            
            events.bind( incrementButton, [ 'click', 'touchend' ], function( evt )
            {
                PlaySound( 'increaseCount' );
                
                cart.AddProduct( product );
                UpdateView();
            });
            
            events.bind( decrementButton, [ 'click', 'touchend' ], function( evt )
            {
                PlaySound( 'decreaseCount' );
                
                cart.RemoveProduct( product );
                UpdateView();
            });
            
            events.bind( productElem, [ 'click', 'mousedown', 'touchend' ], function( evt )
            {
                evt.preventDefault();
            });
            
            events.bind( cart.events, 'change', function( evt )
            {
                if( ( evt.product !== undefined ) && ( evt.product !== product ) )
                {
                    return;
                }
                
                UpdateView();
            });
            
            function InitView()
            {
                var priceAmount = productElem.$( '> .summary > .price > .amount > .value' );
                var priceQty = productElem.$( '> .summary > .price > .volume > .qty' );
                var priceSuffix = productElem.$( '> .summary > .price > .volume > .suffix' );
                var maxQuantity = productElem.$( '> .order > .volume > .max > .qty' );
                var maxQuantitySuffix = productElem.$( '> .order > .volume > .max > .suffix' );
                
                var priceScale = product.GetAmountScale( product.unitAmount );
                var maxQuantityScale, maxAmount = product.maxAmount;
                
                if( maxAmount === undefined )
                {
                    maxQuantityScale = priceScale;
                }
                else
                {
                    maxQuantityScale = product.GetAmountScale( maxAmount );
                }
                
                priceAmount.textContent = product.unitPrice.toCurrencyString();
                priceQty.textContent = priceScale.Normalize( product.unitAmount );
                priceSuffix.innerHTML = priceScale.htmlPostfix;
                
                if( maxAmount !== undefined )
                {
                    maxQuantity.textContent = maxQuantityScale.Normalize( maxAmount );
                }
                else
                {
                    maxQuantity.innerHTML = '∞';
                }
                
                maxQuantitySuffix.innerHTML = maxQuantityScale.htmlPostfix;
                
                if( dataset.has( productElem, 'count' ) )
                {
                    cart.AddProduct( product, false );
                }
                
                UpdateView();
            };
            
            function UpdateView()
            {
                var productOrder = cart.GetProductOrder( product );
                var totalAmount;
                var totalPrice;
                
                if( productOrder !== undefined )
                {
                    totalAmount = productOrder.totalAmount;
                    totalPrice = productOrder.totalPrice;
                    dataset.set( productElem, 'count', productOrder.units.toString() );
                }
                else
                {
                    totalAmount = new Decimal( '0' );
                    totalPrice = new Decimal( '0' );
                    dataset.remove( productElem, 'count' );
                }
                
                var amountScale = product.GetAmountScale( totalAmount );
                
                currentQuantity.textContent = amountScale.Normalize( totalAmount );
                currentQuantitySuffix.innerHTML = amountScale.htmlPostfix;
                currentPriceTotal.textContent = totalPrice.toCurrencyString();
            };
        });
    };
    
    function InitCart( cartElem )
    {
        var amountElem = cartElem.$( '> .summary > .total > .amount > .value' );
        var clearButtonElem = cartElem.$( '> .summary > .actions > .cancel' );
        var proceedButtonElem = cartElem.$( '> .summary > .actions > .proceed' );
        var itemsElem = cartElem.$( '> .items' );
        
        events.bind( cart.events, 'change', function( evt )
        {
            UpdateView();
        });
        
        if( clearButtonElem !== undefined )
        {
            events.bind( clearButtonElem, [ 'click', 'touchend' ], function( evt )
            {
                evt.preventDefault();
                
                PlaySound( 'clear' );
                
                cart.Clear();
                events.trigger( cartElem, 'clear' );
            });
        }
        
        events.bind( proceedButtonElem, [ 'click', 'touchend' ], function( evt )
        {
            evt.preventDefault();
            
            events.trigger( cartElem, 'proceed' );
        });
        
        InitView();
        
        function InitView()
        {
            UpdateView();
        };
        
        function UpdateView()
        {
            /*
             * Not the best way to update cart contents:
             * 1) Remove all nodes;
             * 2) Insert nodes describing each product.
             * 
             * Would work better if ProductOrder would be linked directly
             * to the corresponding cart content node.
             */
            itemsElem.removeChildNodes();
            
            var totalAmount = new Decimal( '0' );
            
            for( var i = 0; i < cart.length; ++i )
            {
                var productOrder = cart[ i ];
                var product = productOrder.product;
                var amountScale = product.GetAmountScale( productOrder.totalAmount );
                
                // FIXME: pull HTML from within document. Hardcoded HTML in JS
                // is not a good practice.
                var frag = dom.parse
                (
                    '<li class="item">' +
                        '<span class="name"></span>, ' +
                        '<span class="qty"></span>, ' +
                        '<span class="total">' +
                            '<span class="currency">Ls</span> ' +
                            '<span class="value"></span>' +
                        '</span>' +
                    '</li>'
                );
                
                $( '> .item > .name', frag ).textContent = product.name;
                $( '> .item > .qty', frag ).innerHTML =
                    amountScale.GetHTML( productOrder.totalAmount );
                $( '> .item > .total > .value', frag ).textContent = productOrder.totalPrice.toCurrencyString();
                
                itemsElem.appendChild( frag );
                
                totalAmount = totalAmount.plus( productOrder.totalPrice );
            }
            
            dataset.set( cartElem, 'items', cart.length );
            amountElem.textContent = totalAmount.toCurrencyString();
        };
    };
    
    function SelectCategory( cat )
    {
        if( selectedCategory !== undefined )
        {
            selectedCategory.isSelected = false;
        }
        
        cat.isSelected = true;
        selectedCategory = cat;
    };
    
    function UpdateServer( options )
    {
        if( options === undefined )
        {
            options = {};
        }
        
        options = UpdateServer.options.mergeSkel( options );
        
        app.loading = true;
        
        var cartXMLContent = cart.Export();
        var req = new requests.PostXML( cartXMLContent );
        req.url = app.GetURI( 'Review.xhtml' );
        
        events.bind( req.events, 'success', function()
        {
            options.on.success();
        });
        
        events.bind( req.events, 'error', function( evt )
        {
            options.on.error( evt.error );
        });
        
        events.bind( req.events, 'complete', function()
        {
            app.loading = false;
        });
        
        req.Send();
        
        return req;
    };
    
    UpdateServer.options =
    {
        on:
        {
            success: function()
            {
                
            },
            error: function( error )
            {
                alert( 'Nesanāca sazināties ar serveri (' + error + ').' + "\n" +
                       'Mēģiniet atkārtot pēdējo darbību vēlreiz.' );
            }
        }
    };
    
    var sounds =
    {
        increaseCount: 'app/product.increase.sound.oga',
        decreaseCount: 'app/product.decrease.sound.oga',
        clear: 'app/cart.clear.sound.ogg'
    };
    
    var activeSounds = {};
    
    var PlaySound;
    
    if( Audio === undefined )
    {
        PlaySound = function( name )
        {
            // sounds not supported
        };
    }
    else
    {
        PlaySound = function( name )
        {
            if( sounds[ name ] === undefined )
            {
                return;
            }
            
            if( name in activeSounds )
            {
                activeSounds[ name ].pause();
            }
            
            activeSounds[ name ] = new Audio( sounds[ name ] );
            activeSounds[ name ].play();
        };
    };
    
    var exposedAPI =
    {
        InitCategories: InitCategories,
        InitProducts: InitProducts,
        InitCart: InitCart,
        UpdateServer: UpdateServer,
        cart: cart
    };
    Object.seal( exposedAPI );
    
    Object.defineProperty( app, 'order',
    {
        value: exposedAPI
    });
    
})( window.app );