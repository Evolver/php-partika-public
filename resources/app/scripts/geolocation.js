/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function( api )
{
    var Request = Object.derive(
    {
        proto: function( proto )
        {
            // Shall be flipped to true once complete
            proto.complete = false;
            
            proto.abort = function()
            {
                throw 'Not supported';
            };
        }
    });
    
    var DevicePositionRequest = Request.derive(
    {
        constr: function( options )
        {
            console.assert( 'geolocation' in navigator );
            
            if( options === undefined )
            {
                options = {};
            }
            
            options = this.options = DevicePositionRequest.options.mergeSkel( options );
            options.on.begin();
            
            console.log( 'Device position request started. Issuing watchPosition() call' );
            
            this.requestId = navigator.geolocation.watchPosition(
                OnSuccess.bind( this ),
                OnError.bind( this ),
                options.config
            );
            
            function OnSuccess( pos )
            {
                console.log( 'watchPosition() succeeded', pos );
                
                options.on.success( pos );
                Complete.call( this );
            };
            
            function OnError( error )
            {
                console.log( 'watchPosition() failed', error );
                
                options.on.error( error );
                Complete.call( this );
            };
            
            function Complete()
            {
                this.terminateWatch();
                options.on.complete();
            };
        },
        proto: function( proto, parent )
        {
            proto.abort = function()
            {
                if( this.complete )
                {
                    return;
                }
                
                console.log( 'Aborting device position request' );
                
                this.terminateWatch();
                this.options.on.abort();
                this.options.on.complete();
            };
            
            proto.terminateWatch = function()
            {
                console.assert( !this.complete );
                console.log( 'Issuing clearWatch() call' );
                
                navigator.geolocation.clearWatch( this.requestId );
                this.complete = true;
            };
        }
    });
    
    DevicePositionRequest.options =
    {
        config:
        {
            highAccuracy: true,
            maximumAge: 0,
            timeout: Infinity
        },
        on:
        {
            begin: function() { },
            success: function( pos ) { },
            error: function( error ) { },
            abort: function() { },
            complete: function() { }
        }
    };
    
    function GetDevicePosition( options )
    {
        return new DevicePositionRequest( options );
    };
    
    var GeocoderRequest = Request.derive(
    {
        constr: function( options )
        {
            console.assert( google !== undefined );
            console.assert( google.maps !== undefined );
            console.assert( google.maps.Geocoder !== undefined );
            
            var Geocoder = google.maps.Geocoder;
            var GeocoderStatus = google.maps.GeocoderStatus;
            
            if( options === undefined )
            {
                options = {};
            }
            
            options = GeocoderRequest.options.mergeSkel( options );
            options.on.begin();
            
            console.log( 'Issuing geocoder.geocode() call' );
            
            // https://developers.google.com/maps/documentation/javascript/reference#Geocoder
            this.geocoder = new Geocoder;
            this.geocoder.geocode( options.query, OnGeocoderResponse.bind( this ) );
            
            function OnGeocoderResponse( result, status )
            {
                console.log( 'Geocoder response obtained', status, result );
                this.complete = true;
                
                switch( status )
                {
                    case GeocoderStatus.OK:
                    {
                        options.on.success( result );
                        break;
                    }
                    
                    case GeocoderStatus.ZERO_RESULTS:
                    {
                        if( options.errorOnNoResults )
                        {
                            options.on.error( MakeError( status ) );
                        }
                        else
                        {
                            options.on.success( new Array );
                        }
                        break;
                    }
                    
                    default:
                    {
                        options.on.error( MakeError( status ) );
                        break;
                    }
                }
                
                options.on.complete();
                
                /**
                 * Provide error info in the following form:
                 *  error.code                  - error code.
                 *  error.OK                    - OK error code.
                 *  error.INVALID_REQUEST       - Invalid request error core.
                 *  ...
                 */
                function MakeError( status )
                {
                    var error = google.maps.GeocoderStatus.clone();
                    error.code = status;
                    return error;
                };
            };
        }
    });
    
    GeocoderRequest.options =
    {
        errorOnNoResults: false,
        query:
        {
            // Shall contain geocoder query parameters.
            // https://developers.google.com/maps/documentation/javascript/reference#GeocoderRequest
        },
        on:
        {
            begin: function() { },
            success: function( result ) { },
            error: function( error ) { },
            complete: function() { }
        }
    };
    
    function GetAddressByPosition( options )
    {
        var LatLng = google.maps.LatLng;
        var options = arguments.callee.options.mergeSkel( options );
        
        return new GeocoderRequest(
        {
            errorOnNoResults: true,
            query:
            {
                location: new LatLng( options.lat, options.lng )
            },
            on:
            {
                begin: options.on.begin,
                success: function( result )
                {
                    options.on.success( result );
                },
                error: options.on.error,
                complete: options.on.complete
            }
        });
    };
    
    GetAddressByPosition.options =
    {
        lat: undefined,
        lng: undefined,
        on:
        {
            begin: function() { },
            success: function( result ) { },
            error: function( error ) { },
            complete: function() { }
        }
    };
    
    function GetPositionByAddress( options )
    {
        options = arguments.callee.options.mergeSkel( options );
        
        return new GeocoderRequest(
        {
            errorOnNoResults: true,
            query:
            {
                address: options.address,
                region: options.region
            },
            on:
            {
                begin: options.on.begin,
                success: function( result )
                {
                    options.on.success( result );
                },
                error: options.on.error,
                complete: options.on.complete
            }
        });
    };
    
    GetPositionByAddress.options =
    {
        address: undefined,
        region: undefined,
        on:
        {
            begin: function() { },
            success: function( result ) { },
            error: function( reason ) { },
            complete: function() { }
        }
    };

    /**
     * Expose custom event API to the "outside world".
     */
    var exposedAPI =
    {
        Request: Request,
        getDevicePosition: GetDevicePosition,
        getAddressByPosition: GetAddressByPosition,
        getPositionByAddress: GetPositionByAddress
    };
    
    Object.seal( exposedAPI );
    
    Object.defineProperty( api, 'geo',
    {
        value: exposedAPI
    });
    
})( window );