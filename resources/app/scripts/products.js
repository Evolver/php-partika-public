/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function( api )
{
    var AmountScale = Object.derive(
    {
        /**
         * Constructor.
         * 
         * @param Number magnitude
         *  A number which is a power of ten.
         *  
         * @param String postfix
         *  Postfix string.
         *  
         * @param String htmlPostfix
         *  Postfix string with HTML formatting.
         *  If omitted, same as postfix.
         */
        constr: function( magnitude, postfix, htmlPostfix )
        {
            if( htmlPostfix === undefined )
            {
                htmlPostfix = postfix;
            }
            
            this.magnitude = magnitude;
            this.postfix = postfix;
            this.htmlPostfix = htmlPostfix;
        },
        
        proto: function( proto )
        {
            Object.defineProperties( proto,
            {
                Normalize:
                {
                    value: function( amount )
                    {
                        return amount.div( this.magnitude ).toFormattedNumberString();
                    }
                },
                
                GetString:
                {
                    value: function( amount )
                    {
                        return this.Normalize( amount ).toString() + this.postfix;
                    }
                },
                
                GetHTML:
                {
                    value: function( amount )
                    {
                        return this.Normalize( amount ).toString() + this.htmlPostfix;
                    }
                }
            });
        }
    });
    
    var AmountScales = Array.derive(
    {
        constr: function()
        {
            for( var i = 0; i < arguments.length; ++i )
            {
                this.push( arguments[ i ] );
            }
        },
        
        proto: function( proto )
        {
            Object.defineProperties( proto,
            {
                GetScale:
                {
                    value: function( amount )
                    {
                        console.assert( this.length > 0 );
                        amount = amount.abs();
                        
                        for( var i = 0; i < this.length; ++i )
                        {
                            var scale = this[ i ];
                            
                            if( amount.gte( scale.magnitude ) )
                            {
                                return scale;
                            }
                        }
                        
                        return this[ this.length - 1 ];
                    }
                }
            });
        }
    });
    
    var AmountTypes =
    {
        Weight: 'Weight',
        Volume_Solids: 'Volume_Solids',
        Volume_Liquids: 'Volume_Liquids',
        Quantity: 'Quantity'
    };
    
    /**
     * List of supported amount formats.
     * Formats must be sorted by magnitude in descending order.
     */
    var AmountFormats =
    {
        // 1 unit = 1 kg
        Weight: new AmountScales
        (
            new AmountScale( new Decimal( '1000' ), 't' ),
            new AmountScale( new Decimal( '100' ), 'ct' ),
            new AmountScale( new Decimal( '1' ), 'kg' ),
            new AmountScale( new Decimal( '0.001' ), 'g' ),
            new AmountScale( new Decimal( '0.000001' ), 'mg' )
        ),
        
        // 1 unit = 1 m3
        Volume_Solids: new AmountScales
        (
            new AmountScale( new Decimal( '1' ), 'm3', 'm<sup>3</sup>' ),
            new AmountScale( new Decimal( '0.001' ), 'dm3', 'dm<sup>3</sup>' ),
            new AmountScale( new Decimal( '0.000001' ), 'cm3', 'cm<sup>3</sup>' )
        ),
        
        // 1 unit = 1 litre
        Volume_Liquids: new AmountScales
        (
            new AmountScale( new Decimal( '1' ), 'L' ),
            new AmountScale( new Decimal( '0.001' ), 'ml' )
        ),
        
        // 1 unit = 1 piece
        Quantity: new AmountScales
        (
            new AmountScale( new Decimal( '1' ), 'gab' )
        )
    };
    
    // Represents a single product category
    var Category = Object.derive(
    {
        constr: function( elem )
        {
            Object.defineProperties( this,
            {
                elem:
                {
                    value: elem
                }
            });
        },
        
        proto: function( proto )
        {
            Object.defineProperties( proto,
            {
                id:
                {
                    get: function()
                    {
                        return dataset.get( this.elem, 'id' );
                    }
                },
                
                name:
                {
                    get: function()
                    {
                        return $( '> .title', this.elem ).textContent.trim();
                    }
                },
                
                isSelected:
                {
                    get: function()
                    {
                        return this.elem.classList.contains( 'selected' );
                    },
                    set: function( enable )
                    {
                        if( enable )
                        {
                            this.elem.classList.add( 'selected' );
                        }
                        else
                        {
                            this.elem.classList.remove( 'selected' );
                        }
                    }
                },
                
                products:
                {
                    get: function()
                    {
                        return $( '> .products', this.elem );
                    }
                }
            });
        }
    });
    
    // Represents a single product
    var Product = Object.derive(
    {
        constr: function( elem )
        {
            Object.defineProperties( this,
            {
                elem:
                {
                    value: elem
                }
            });
        },
        
        proto: function( proto )
        {
            Object.defineProperties( proto,
            {
                id:
                {
                    get: function()
                    {
                        return dataset.get( this.elem, 'id' );
                    }
                },
                
                name:
                {
                    get: function()
                    {
                        return $( '> .summary > .name', this.elem ).textContent.trim();
                    }
                },
                
                unitType:
                {
                    get: function()
                    {
                        return dataset.get( this.elem, 'unitType' );
                    }
                },
                
                unitAmount:
                {
                    get: function()
                    {
                        var ret = dataset.get( this.elem, 'unitAmount' );
                        
                        if( ret === undefined )
                        {
                            ret = '1';
                        }
                        
                        return new Decimal( ret );
                    }
                },
                
                unitPrice:
                {
                    get: function()
                    {
                        var ret = dataset.get( this.elem, 'unitPrice' );
                        
                        if( ret !== undefined )
                        {
                            ret = new Decimal( ret );
                        }
                        
                        return ret;
                    }
                },
                
                minUnits:
                {
                    get: function()
                    {
                        var ret = dataset.get( this.elem, 'unitMin' );
                        
                        if( ret !== undefined )
                        {
                            ret = new Decimal( ret );
                        }
                        
                        return ret;
                    }
                },
                
                maxUnits:
                {
                    get: function()
                    {
                        var ret = dataset.get( this.elem, 'unitMax' );
                        
                        if( ret !== undefined )
                        {
                            ret = new Decimal( ret );
                        }
                        
                        return ret;
                    }
                },
                
                maxAmount:
                {
                    get: function()
                    {
                        var maxUnits = this.maxUnits;
                        
                        if( maxUnits === undefined )
                        {
                            return undefined;
                        }
                        
                        return maxUnits.times( this.unitAmount );
                    }
                },
                
                amountFormat:
                {
                    get: function()
                    {
                        return AmountFormats[ this.unitType ];
                    }
                },
                
                GetAmountScale:
                {
                    value: function( amount )
                    {
                        return this.amountFormat.GetScale( amount );
                    }
                },
                
                GetAmountString:
                {
                    value: function( amount )
                    {
                        return this.GetAmountScale( amount ).GetString( amount );
                    }
                },
                
                GetAmountHTML:
                {
                    value: function( amount )
                    {
                        return this.GetAmountScale( amount ).GetHTML( amount );
                    }
                },
                
                IsMaxUnits:
                {
                    value: function( units )
                    {
                        if( this.maxUnits === undefined )
                        {
                            return false;
                        }
                        
                        if( this.maxUnits.gt( units ) )
                        {
                            return false;
                        }
                        
                        return true;
                    }
                }
            });
        }
    });
    
    // Represents a product of a varying quantity
    var ProductOrder = Object.derive(
    {
        constr: function( prod )
        {
            var minUnits = prod.minUnits;
            if( minUnits === undefined )
            {
                minUnits = new Decimal( '1' );
            }
            
            Object.defineProperties( this,
            {
                elem:
                {
                    value: prod.elem
                },
                
                product:
                {
                    value: prod
                },
                
                events:
                {
                    value: new events.Listener
                },
                
                minUnits:
                {
                    value: minUnits
                }
            });
            
            this.Update();
        },
        
        proto: function( proto )
        {
            Object.defineProperties( proto,
            {
                units:
                {
                    get: function()
                    {
                        var value;
                        
                        if( dataset.has( this.elem, 'count' ) )
                        {
                            value = dataset.get( this.elem, 'count' );
                        }
                        else
                        {
                            value = '0';
                        }
                        
                        return new Decimal( value );
                    },
                    set: function( value )
                    {
                        if( value.eq( '0' ) )
                        {
                            dataset.remove( this.elem, 'count' );
                        }
                        else
                        {
                            dataset.set( this.elem, 'count', value.toString() );
                        }
                    }
                },
                
                totalAmount:
                {
                    get: function()
                    {
                        return this.units.times( this.product.unitAmount );
                    }
                },
                
                totalAmountString:
                {
                    get: function()
                    {
                        return this.product.GetAmountString( this.totalAmount );
                    }
                },
                
                totalAmountHTML:
                {
                    get: function()
                    {
                        return this.product.GetAmountHTML( this.totalAmount );
                    }
                },
                
                totalPrice:
                {
                    get: function()
                    {
                        return this.units.times( this.product.unitPrice );
                    }
                },
                
                Increment:
                {
                    value: function()
                    {
                        if( this.product.IsMaxUnits( this.units ) )
                        {
                            throw 'Maximum unit count reached';
                        }
                        
                        if( this.units.eq( '0' ) )
                        {
                            this.units = this.minUnits;
                        }
                        else
                        {
                            this.units = this.units.plus( '1' );
                        }
                        
                        this.Update();
                        
                        events.trigger( this.events, 'increment' );
                        events.trigger( this.events, 'change' );
                        
                        return this.units;
                    }
                },
                
                Decrement:
                {
                    value: function()
                    {
                        if( this.units.eq( '0' ) )
                        {
                            throw 'Minimum unit count reached';
                        }
                        
                        if( this.units.eq( this.minUnits ) )
                        {
                            this.units = new Decimal( '0' );
                        }
                        else
                        {
                            this.units = this.units.minus( '1' );
                        }
                        
                        this.Update();
                        
                        events.trigger( this.events, 'decrement' );
                        events.trigger( this.events, 'change' );
                        
                        return this.units;
                    }
                },
                
                Clear:
                {
                    value: function()
                    {
                        if( this.units.eq( '0' ) )
                        {
                            return;
                        }
                        
                        this.units = new Decimal( '0' );
                        this.Update();
                        
                        events.trigger( this.events, 'clear' );
                        events.trigger( this.events, 'change' );
                    }
                },
                
                Update:
                {
                    value: function()
                    {
                        Update.call( this );
                    }
                }
            });
            
            function Update()
            {
                if( this.product.IsMaxUnits( this.units ) )
                {
                    this.elem.classList.add( 'maximum' );
                }
                else
                {
                    this.elem.classList.remove( 'maximum' );
                }
            };
        }
    });
    
    // Represents list of products added to a shopping cart
    var Cart = Array.derive(
    {
        constr: function()
        {
            for( var i = 0; i < arguments.length; ++i )
            {
                this.push( arguments[ i ] );
            }
            
            Object.defineProperties( this,
            {
                events:
                {
                    value: new events.Listener
                }
            });
        },
        
        proto: function( proto, parent )
        {
            function GetProductIndex( product )
            {
                for( var i = 0; i < this.length; ++i )
                {
                    if( this[ i ].product === product )
                    {
                        return i;
                    }
                }
                
                return undefined;
            };
            
            function AddProduct( product )
            {
                console.assert( GetProductIndex.call( this, product ) === undefined );
                
                var order = new ProductOrder( product );
                this.push( order );
                return order;
            };
            
            function RemoveProduct( product )
            {
                var i = GetProductIndex.call( this, product );
                
                if( i === undefined )
                {
                    return;
                }
                
                this.splice( i, 1 );
            };
            
            function GetProductOrder( product )
            {
                var i = GetProductIndex.call( this, product );
                var order;
                
                if( i !== undefined )
                {
                    order = this[ i ];
                }
                else
                {
                    order = AddProduct.call( this, product );
                }
                
                return order;
            };
            
            Object.defineProperties( proto,
            {
                totalPrice:
                {
                    get: function()
                    {
                        var total = new Decimal( '0' );
                        
                        for( var i = 0; i < this.length; ++i )
                        {
                            total = total.plus( this[ i ].totalPrice );
                        }
                        
                        return total;
                    }
                },
                
                AddProduct:
                {
                    value: function( product, increment )
                    {
                        if( increment === undefined )
                        {
                            increment = true;
                        }
                        
                        var order = GetProductOrder.call( this, product );
                        var count;
                        
                        if( increment )
                        {
                            count = order.Increment();
                            
                            events.trigger( this.events, 'increment',
                            {
                                product: product,
                                order: order,
                                count: count
                            });
                        }
                        else
                        {
                            count = order.units;
                        }
                        
                        events.trigger( this.events, 'change',
                        {
                            product: product,
                            order: order,
                            count: count
                        });
                    }
                },
                
                RemoveProduct:
                {
                    value: function( product )
                    {
                        var order = GetProductOrder.call( this, product );
                        var remaining = order.Decrement();
                        
                        if( remaining == 0 )
                        {
                            RemoveProduct.call( this, product );
                        }
                        
                        events.trigger( this.events, 'decrement',
                        {
                            product: product,
                            order: order,
                            count: remaining
                        });
                        
                        events.trigger( this.events, 'change',
                        {
                            product: product,
                            order: order,
                            count: remaining
                        });
                    }
                },
                
                Clear:
                {
                    value: function()
                    {
                        if( this.length == 0 )
                        {
                            return;
                        }
                        
                        this.forEach( function( productOrder )
                        {
                            productOrder.Clear();
                        });
                        
                        this.splice( 0, this.length );
                        
                        events.trigger( this.events, 'clear' );
                        events.trigger( this.events, 'change' );
                    }
                },
                
                GetProductOrder:
                {
                    value: function( product )
                    {
                        var i = GetProductIndex.call( this, product );
                        
                        if( i === undefined )
                        {
                            return undefined;
                        }
                        
                        return this[ i ];
                    }
                },
                
                Export:
                {
                    value: function()
                    {
                        var xmlns = app.config.xmlns;
                        var frag = document.createDocumentFragment();
                        
                        var cartElem = document.createElementNS( xmlns, 'cart' );
                        
                        this.forEach( function( productOrder )
                        {
                            var orderElem = document.createElementNS( xmlns, 'product' );
                            orderElem.setAttributeNS( xmlns, 'id', productOrder.product.id );
                            orderElem.setAttributeNS( xmlns, 'units', productOrder.units );
                            cartElem.appendChild( orderElem );
                        });
                        
                        frag.appendChild( cartElem );
                        
                        return frag;
                    }
                }
            })
        }
    });
    
    var exposedAPI =
    {
        Category: Category,
        Product: Product,
        ProductOrder: ProductOrder,
        Cart: Cart,
        AmountFormats: AmountFormats
    };
    
    Object.defineProperty( api, 'products',
    {
        value: exposedAPI
    });
    
    Object.seal( exposedAPI );

})( window.app );