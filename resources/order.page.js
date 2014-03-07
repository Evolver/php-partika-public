/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function( app )
{
    var defaultShippingAddress =
    {
        // Riga city center
        lat: 56.949925,
        lng: 24.106021,
        title: 'Rīgas centrs'
    };
    
    var form;
    var cartElem;
    var shippingAddress;
    
    document.ready( function()
    {
        form = $( 'body > article > form' );
        shippingAddress = form.$( '> ul > .shippingAddress' );
        cartElem = $( 'body > header > .cart' );
        
        InitCart();
        InitForm();
        
        function InitCart()
        {
            FormatAsCurrency( cartElem.$( '> .summary > .total > .amount > .value' ) );
        };
        
        function InitForm()
        {
            FormatAsCurrency( form.$( '> ul > .shippingCost > .value > .value' ) );
            FormatAsCurrency( form.$( '> ul > .totalCost > .value > .value' ) );
            
            // Add "focused" class to form elements that receive focus.
            $$( '> ul > li', form ).forEach( function( elem )
            {
                events.bind( elem, 'focus', function()
                {
                    this.classList.add( 'focused' );
                },
                true );
            
                events.bind( elem, 'blur', function()
                {
                    this.classList.remove( 'focused' );
                },
                true );
            });
            
            // Take invalid input message from "data-invalid-message" property.
            $$( '> ul > li input', form ).forEach( function( elem )
            {
                events.bindCapture( elem, 'invalid', function()
                {
                    if( attr.has( elem, 'data-invalid-message' ) )
                    {
                        if( !this.validity.customError )
                        {
                            this.setCustomValidity( attr.get( elem, 'data-invalid-message' ) );
                        }
                    }
                });
                
                events.bindCapture( elem, 'input', function()
                {
                    this.setCustomValidity( '' );
                });
            });
            
            // Select contents of text inputs when focused
            $$( '> ul > li input[type="text"], > ul > li input[type="tel"]', form ).forEach( function( elem )
            {
                events.bind( elem, 'focus', function()
                {
                    this.select.callLater( this );
                });
            });
        };
    });
    
    events.bind( window, 'load', function()
    {
        InitMap();
        
        function InitMap()
        {
            var Map = google.maps.Map;
            var MapTypeId = google.maps.MapTypeId;
            var LatLng = google.maps.LatLng;
            var Marker = google.maps.Marker;
            var Geocoder = google.maps.Geocoder;
            var GeocoderStatus = google.maps.GeocoderStatus;
            var Animation = google.maps.Animation;
            
            var mapElem = $( '> .map > .canvas', shippingAddress );
            var addressInputElem = $( '> .value', shippingAddress );
            
            var devicePositionRequest = undefined;
            
            var map = new Map( mapElem,
            {
                mapTypeControl: false,
                mapTypeId: MapTypeId.ROADMAP,
                streetViewControl: false,
                disableDoubleClickZoom: true,
                zoom: 15
            });
            
            var geocoder = new Geocoder;
            
            var marker = new Marker(
            {
                map: map,
                
                /**
                 * Marker will not show up in AppleWebKit/534.30, Galaxy Tab 10 without
                 * this option.
                 */
                optimized: false,
                
                animation: Animation.DROP
            });
            
            /**
             * Time to wait for user to stop typing shipping location. When timer expires,
             * the entered location is looked up via geocoder and is displayed on the map.
             */
            var mapUpdateDelay = 1000;
            
            /**
             * Timer that is waiting for user to stop typing shipping location.
             * The timer is reset each time the user presses a key. If timer expires,
             * the entered location is looked up via geocoder and is displayed on the map.
             */
            var mapUpdateTimer = undefined;
            
            var loadingReentrancy = 0;
            
            /**
             * Abort any pending device position request if address input is focused
             * while position request is in progress.
             */
            events.bindCapture( addressInputElem, 'focus', function()
            {
                if( ( devicePositionRequest !== undefined ) && ( !devicePositionRequest.complete ) )
                {
                    devicePositionRequest.abort();
                    devicePositionRequest = undefined;
                }
            });
            
            events.bind( addressInputElem, 'input', function()
            {
                if( mapUpdateTimer !== undefined )
                {
                    clearTimeout( mapUpdateTimer );
                }
                
                mapUpdateTimer = setTimeout( DisplayLocationOnMap, mapUpdateDelay );
                
                function DisplayLocationOnMap()
                {
                    mapUpdateTimer = undefined;
                    
                    var address = addressInputElem.value;
                    
                    if( address.length == 0 )
                    {
                        return;
                    }
                    
                    geo.getPositionByAddress(
                    {
                        address: address,
                        region: 'lv-LV',
                        on:
                        {
                            begin: function()
                            {
                                BeginLoading();
                            },
                            success: function( results )
                            {
                                /**
                                 * If user has managed to change address value while we've been
                                 * querying for location, do not update the map. Rather, wait for next
                                 * query for the matching address to occur.
                                 */
                                if( addressInputElem.value !== address )
                                {
                                    return;
                                }
                                
                                var firstResult = results[ 0 ];
                                
                                SetLocation(
                                {
                                    latlng: firstResult.geometry.location,
                                    viewport: firstResult.geometry.viewport,
                                    address: address
                                });
                            },
                            error: function( reason )
                            {
                                addressInputElem.setCustomValidity( 'Neatpazīta adrese. Ievadiet precīzāku adresi.' );
                            },
                            complete: function()
                            {
                                EndLoading();
                            }
                        }
                    });
                }
            });
            
            /**
             * Whenever the map is clicked, change shipping address to that particular
             * location.
             */
            google.maps.event.addListener( map, 'click', function( e )
            {
                SetLocationFromPoint( e.latLng );
            });
            
            try
            {
                devicePositionRequest = geo.getDevicePosition(
                {
                    on:
                    {
                        begin: function()
                        {
                            BeginLoading();
                            
                            addressInputElem.prevPlaceholder = addressInputElem.placeholder;
                            addressInputElem.placeholder = 'Meklēju tevi...';
                        },
                        success: function( pos )
                        {
                            SetLocationFromPoint( new LatLng( pos.coords.latitude, pos.coords.longitude ) );
                        },
                        error: function( error )
                        {
                            console.log( 'Could not obtain device location. Error = ' + error.message );
                            SetDefaultLocation();
                        },
                        abort: function()
                        {
                            console.log( 'Device position request aborted' );
                            SetDefaultLocation();
                        },
                        complete: function()
                        {
                            addressInputElem.placeholder = addressInputElem.prevPlaceholder;
                            
                            EndLoading();
                        }
                    }
                });
            }
            catch( e )
            {
                console.info( 'Geolocation is not supported. Will position map at default shipping address.' );
                SetDefaultLocation();
            }
            
            function SetLocation( options )
            {
                var options = arguments.callee.options.mergeSkel( options );
                
                if( options.latlng !== undefined )
                {
                    map.panTo( options.latlng );
                    marker.setPosition( options.latlng );
                }
                
                if( options.viewport !== undefined )
                {
                    map.fitBounds( options.viewport );
                }
                
                if( options.title !== undefined )
                {
                    marker.setTitle( options.title );
                }
                else if( options.address !== undefined )
                {
                    marker.setTitle( options.address );
                }
                
                addressInputElem.setCustomValidity( '' );
                
                if( options.address !== undefined )
                {
                    addressInputElem.value = options.address;
                }
                else
                {
                    addressInputElem.value = '';
                }
            };
            
            SetLocation.options =
            {
                latlng: undefined,
                viewport: undefined,
                title: undefined,
                address: undefined
            };
            
            function SetDefaultLocation()
            {
                SetLocation(
                {
                    latlng: new LatLng( defaultShippingAddress.lat, defaultShippingAddress.lng ),
                    title: defaultShippingAddress.title
                });
            };
            
            function SetLocationFromPoint( latlng )
            {
                console.log( 'Setting location from point' );
                
                SetLocation(
                {
                    latlng: latlng
                });
                
                geo.getAddressByPosition(
                {
                    lat: latlng.lat(),
                    lng: latlng.lng(),
                    on:
                    {
                        begin: function()
                        {
                            BeginLoading();
                        },
                        success: function( results )
                        {
                            var firstResult = results[ 0 ];
                            
                            SetLocation(
                            {
                                latlng: latlng,
                                address: firstResult.formatted_address
                            });
                        },
                        error: function( error )
                        {
                            console.log( 'Could not obtain address of location point. Error = ' + error.code );
                            
                            SetLocation(
                            {
                                latlng: latlng,
                                address: ''
                            });
                        },
                        complete: function()
                        {
                            EndLoading();
                        }
                    }
                });
            };
            
            function BeginLoading()
            {
                console.assert( loadingReentrancy >= 0 );
                ++loadingReentrancy;
                
                if( loadingReentrancy == 1 )
                {
                    shippingAddress.classList.add( 'loading' );
                }
            };
            
            function EndLoading()
            {
                console.assert( loadingReentrancy > 0 );
                --loadingReentrancy;
                
                if( loadingReentrancy == 0 )
                {
                    shippingAddress.classList.remove( 'loading' );
                }
            };
        };
    });
    
    function FormatAsCurrency( elem )
    {
        elem.textContent = ( new Decimal( elem.textContent ) ).toCurrencyString();
    };
    
})( window.app );