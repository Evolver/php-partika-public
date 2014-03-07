/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function()
{
    var AmountFormats = app.products.AmountFormats;
    var Product = app.products.Product;
    var ProductOrder = app.products.ProductOrder;
    var Cart = app.products.Cart;
    
    // Product.prototype.GetAmountString()
    (function()
    {
        var TestProduct = Product.derive(
        {
            constr: function( amountFormat )
            {
                Product.call( this, 'Test product', amountFormat, 1, 1 );
            }
        });
        
        // Weight
        (function()
        {
            var prod = new TestProduct( AmountFormats.Weight );
            
            console.assert( prod.GetAmountString( 1000000 ) === '1,000t' );
            console.assert( prod.GetAmountString( 100000 ) === '100t' );
            console.assert( prod.GetAmountString( 10000 ) === '10t' );
            console.assert( prod.GetAmountString( 1000 ) === '1t' );
            console.assert( prod.GetAmountString( 100 ) === '1ct' );
            console.assert( prod.GetAmountString( 10 ) === '10kg' );
            console.assert( prod.GetAmountString( 1 ) === '1kg' );
            console.assert( prod.GetAmountString( 0.1 ) === '100g' );
            console.assert( prod.GetAmountString( 0.01 ) === '10g' );
            console.assert( prod.GetAmountString( 0.001 ) === '1g' );
            console.assert( prod.GetAmountString( 0.0001 ) === '100mg' );
            console.assert( prod.GetAmountString( 0.00001 ) === '10mg' );
            console.assert( prod.GetAmountString( 0.000001 ) === '1mg' );
            
        })();
        
        // Volume, Solids
        (function()
        {
            var prod = new TestProduct( AmountFormats.Volume_Solids );
            
            console.assert( prod.GetAmountString( 10000 ) === '10,000m3' );
            console.assert( prod.GetAmountString( 1000 ) === '1,000m3' );
            console.assert( prod.GetAmountString( 100 ) === '100m3' );
            console.assert( prod.GetAmountString( 10 ) === '10m3' );
            console.assert( prod.GetAmountString( 1 ) === '1m3' );
            console.assert( prod.GetAmountString( 0.1 ) === '100dm3' );
            console.assert( prod.GetAmountString( 0.01 ) === '10dm3' );
            console.assert( prod.GetAmountString( 0.001 ) === '1dm3' );
            console.assert( prod.GetAmountString( 0.0001 ) === '100cm3' );
            console.assert( prod.GetAmountString( 0.00001 ) === '10cm3' );
            console.assert( prod.GetAmountString( 0.000001 ) === '1cm3' );
            
        })();
        
        // Volume, Liquids
        (function()
        {
            var prod = new TestProduct( AmountFormats.Volume_Liquids );
            
            console.assert( prod.GetAmountString( 10000 ) === '10,000lit' );
            console.assert( prod.GetAmountString( 1000 ) === '1,000lit' );
            console.assert( prod.GetAmountString( 100 ) === '100lit' );
            console.assert( prod.GetAmountString( 10 ) === '10lit' );
            console.assert( prod.GetAmountString( 1 ) === '1lit' );
            console.assert( prod.GetAmountString( 0.1 ) === '100ml' );
            console.assert( prod.GetAmountString( 0.01 ) === '10ml' );
            console.assert( prod.GetAmountString( 0.001 ) === '1ml' );
            console.assert( prod.GetAmountString( 0.0001 ) === '0.1ml' );
            console.assert( prod.GetAmountString( 0.00001 ) === '0.01ml' );
            console.assert( prod.GetAmountString( 0.000001 ) === '0.001ml' );
            
        })();
        
        // Quantity
        (function()
        {
            var prod = new TestProduct( AmountFormats.Quantity );
            
            console.assert( prod.GetAmountString( 10000 ) === '10,000gab' );
            console.assert( prod.GetAmountString( 1000 ) === '1,000gab' );
            console.assert( prod.GetAmountString( 100 ) === '100gab' );
            console.assert( prod.GetAmountString( 10 ) === '10gab' );
            console.assert( prod.GetAmountString( 1 ) === '1gab' );
            console.assert( prod.GetAmountString( 0.1 ) === '0.1gab' );
            console.assert( prod.GetAmountString( 0.01 ) === '0.01gab' );
            console.assert( prod.GetAmountString( 0.001 ) === '0.001gab' );
            
        })();
        
    })();
    
    // Product.prototype.GetAmountHTML()
    (function()
    {
        var TestProduct = Product.derive(
        {
            constr: function( amountFormat )
            {
                Product.call( this, 'Test product', amountFormat, 1, 1 );
            }
        });
        
        // Weight
        (function()
        {
            var prod = new TestProduct( AmountFormats.Weight );
            
            console.assert( prod.GetAmountHTML( 1000000 ) === '1,000t' );
            console.assert( prod.GetAmountHTML( 100000 ) === '100t' );
            console.assert( prod.GetAmountHTML( 10000 ) === '10t' );
            console.assert( prod.GetAmountHTML( 1000 ) === '1t' );
            console.assert( prod.GetAmountHTML( 100 ) === '1ct' );
            console.assert( prod.GetAmountHTML( 10 ) === '10kg' );
            console.assert( prod.GetAmountHTML( 1 ) === '1kg' );
            console.assert( prod.GetAmountHTML( 0.1 ) === '100g' );
            console.assert( prod.GetAmountHTML( 0.01 ) === '10g' );
            console.assert( prod.GetAmountHTML( 0.001 ) === '1g' );
            console.assert( prod.GetAmountHTML( 0.0001 ) === '100mg' );
            console.assert( prod.GetAmountHTML( 0.00001 ) === '10mg' );
            console.assert( prod.GetAmountHTML( 0.000001 ) === '1mg' );
            
        })();
        
        // Volume, Solids
        (function()
        {
            var prod = new TestProduct( AmountFormats.Volume_Solids );
            
            console.assert( prod.GetAmountHTML( 10000 ) === '10,000m<sup>3</sup>' );
            console.assert( prod.GetAmountHTML( 1000 ) === '1,000m<sup>3</sup>' );
            console.assert( prod.GetAmountHTML( 100 ) === '100m<sup>3</sup>' );
            console.assert( prod.GetAmountHTML( 10 ) === '10m<sup>3</sup>' );
            console.assert( prod.GetAmountHTML( 1 ) === '1m<sup>3</sup>' );
            console.assert( prod.GetAmountHTML( 0.1 ) === '100dm<sup>3</sup>' );
            console.assert( prod.GetAmountHTML( 0.01 ) === '10dm<sup>3</sup>' );
            console.assert( prod.GetAmountHTML( 0.001 ) === '1dm<sup>3</sup>' );
            console.assert( prod.GetAmountHTML( 0.0001 ) === '100cm<sup>3</sup>' );
            console.assert( prod.GetAmountHTML( 0.00001 ) === '10cm<sup>3</sup>' );
            console.assert( prod.GetAmountHTML( 0.000001 ) === '1cm<sup>3</sup>' );
            
        })();
        
        // Volume, Liquids
        (function()
        {
            var prod = new TestProduct( AmountFormats.Volume_Liquids );
            
            console.assert( prod.GetAmountHTML( 10000 ) === '10,000lit' );
            console.assert( prod.GetAmountHTML( 1000 ) === '1,000lit' );
            console.assert( prod.GetAmountHTML( 100 ) === '100lit' );
            console.assert( prod.GetAmountHTML( 10 ) === '10lit' );
            console.assert( prod.GetAmountHTML( 1 ) === '1lit' );
            console.assert( prod.GetAmountHTML( 0.1 ) === '100ml' );
            console.assert( prod.GetAmountHTML( 0.01 ) === '10ml' );
            console.assert( prod.GetAmountHTML( 0.001 ) === '1ml' );
            console.assert( prod.GetAmountHTML( 0.0001 ) === '0.1ml' );
            console.assert( prod.GetAmountHTML( 0.00001 ) === '0.01ml' );
            console.assert( prod.GetAmountHTML( 0.000001 ) === '0.001ml' );
            
        })();
        
        // Quantity
        (function()
        {
            var prod = new TestProduct( AmountFormats.Quantity );
            
            console.assert( prod.GetAmountHTML( 10000 ) === '10,000gab' );
            console.assert( prod.GetAmountHTML( 1000 ) === '1,000gab' );
            console.assert( prod.GetAmountHTML( 100 ) === '100gab' );
            console.assert( prod.GetAmountHTML( 10 ) === '10gab' );
            console.assert( prod.GetAmountHTML( 1 ) === '1gab' );
            console.assert( prod.GetAmountHTML( 0.1 ) === '0.1gab' );
            console.assert( prod.GetAmountHTML( 0.01 ) === '0.01gab' );
            console.assert( prod.GetAmountHTML( 0.001 ) === '0.001gab' );
            
        })();
        
    })();
    
    // ProductOrder
    (function()
    {
        var prod = new Product( 'Test product', AmountFormats.Weight, 1, 0.50, 2 );
        var order = new ProductOrder( prod );
        
        var increments = 0;
        var decrements = 0;
        var changes = 0;
        
        events.bind( order.events, 'increment', function()
        {
            ++increments;
        });
        
        events.bind( order.events, 'decrement', function()
        {
            ++decrements;
        });
        
        events.bind( order.events, 'change', function()
        {
            ++changes;
        });
        
        console.assert( order.totalPrice === 0.00 );
        
        order.Increment();
        console.assert( order.totalPrice === 0.50 );
        
        order.Increment();
        console.assert( order.totalPrice === 1.00 );
        
        try
        {
            order.Increment();
            console.assert( false );
        }
        catch( e )
        {
            console.assert( order.totalPrice === 1.00 );
        }
        
        order.Decrement();
        console.assert( order.totalPrice === 0.50 );
        
        order.Decrement();
        console.assert( order.totalPrice === 0.00 );
        
        try
        {
            order.Decrement();
            console.assert( false );
        }
        catch( e )
        {
            console.assert( order.totalPrice === 0.00 );
        }
        
        console.assert( increments == 2 );
        console.assert( decrements == 2 );
        console.assert( changes == 4 );
        
    })();
    
    // Cart
    (function()
    {
        var prod1 = new Product( 'Product #1', AmountFormats.Weight, 1, 0.25, 2 );
        var prod2 = new Product( 'Product #2', AmountFormats.Volume_Solids, 1, 0.50, 2 );
        var prod3 = new Product( 'Product #3', AmountFormats.Volume_Liquids, 1, 0.75, 2 );
        var prod4 = new Product( 'Product #4', AmountFormats.Quantity, 1, 1, 2 );
        var cart = new Cart;
        
        var increments = 0;
        var decrements = 0;
        var changes = 0;
        
        events.bind( cart.events, 'increment', function()
        {
            ++increments;
        });
        
        events.bind( cart.events, 'decrement', function()
        {
            ++decrements;
        });
        
        events.bind( cart.events, 'change', function()
        {
            ++changes;
        });
        
        console.assert( cart.totalPrice === 0 );
        
        cart.AddProduct( prod1 );
        console.assert( cart.totalPrice === 0.25 );
        
        cart.AddProduct( prod2 );
        console.assert( cart.totalPrice === 0.75 );
        
        cart.AddProduct( prod3 );
        console.assert( cart.totalPrice === 1.50 );
        
        cart.AddProduct( prod4 );
        console.assert( cart.totalPrice === 2.50 );
        
        cart.AddProduct( prod1 );
        console.assert( cart.totalPrice === 2.75 );
        
        cart.AddProduct( prod2 );
        console.assert( cart.totalPrice === 3.25 );
        
        cart.AddProduct( prod3 );
        console.assert( cart.totalPrice === 4.00 );
        
        cart.AddProduct( prod4 );
        console.assert( cart.totalPrice === 5.00 );
        
        try
        {
            cart.AddProduct( prod1 );
            console.assert( false );
        }
        catch( e )
        {
            console.assert( cart.totalPrice === 5.00 );
        }
        
        try
        {
            cart.AddProduct( prod2 );
            console.assert( false );
        }
        catch( e )
        {
            console.assert( cart.totalPrice === 5.00 );
        }
        
        try
        {
            cart.AddProduct( prod3 );
            console.assert( false );
        }
        catch( e )
        {
            console.assert( cart.totalPrice === 5.00 );
        }
        
        try
        {
            cart.AddProduct( prod4 );
            console.assert( false );
        }
        catch( e )
        {
            console.assert( cart.totalPrice === 5.00 );
        }
        
        cart.RemoveProduct( prod1 );
        console.assert( cart.totalPrice === 4.75 );
        
        cart.RemoveProduct( prod1 );
        console.assert( cart.totalPrice === 4.50 );
        
        cart.RemoveProduct( prod2 );
        console.assert( cart.totalPrice === 4.00 );
        
        cart.RemoveProduct( prod2 );
        console.assert( cart.totalPrice === 3.50 );
        
        cart.RemoveProduct( prod3 );
        console.assert( cart.totalPrice === 2.75 );
        
        cart.RemoveProduct( prod3 );
        console.assert( cart.totalPrice === 2.00 );
        
        cart.RemoveProduct( prod4 );
        console.assert( cart.totalPrice === 1.00 );
        
        cart.RemoveProduct( prod4 );
        console.assert( cart.totalPrice === 0.00 );
        
        try
        {
            cart.RemoveProduct( prod1 );
            console.assert( false );
        }
        catch( e )
        {
            console.assert( cart.totalPrice === 0.00 );
        }
        
        try
        {
            cart.RemoveProduct( prod2 );
            console.assert( false );
        }
        catch( e )
        {
            console.assert( cart.totalPrice === 0.00 );
        }
        
        try
        {
            cart.RemoveProduct( prod3 );
            console.assert( false );
        }
        catch( e )
        {
            console.assert( cart.totalPrice === 0.00 );
        }
        
        try
        {
            cart.RemoveProduct( prod4 );
            console.assert( false );
        }
        catch( e )
        {
            console.assert( cart.totalPrice === 0.00 );
        }
        
        console.assert( increments == 8 );
        console.assert( decrements == 8 );
        console.assert( changes == 16 );
        
    })();
    
})();