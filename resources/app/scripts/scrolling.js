/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function( api )
{
    // Time period during which "scrolling" class is kept
    // on the documentElement. Milliseconds.
    var scrollingActivityDuration = 300;
    
    // Pixels
    var smoothScrollMaxStep = 200;
    var smoothScrollStepFactor = 3;
    // Milliseconds
    var smoothScrollStepDelay = 20;
    
    var documentElement = document.documentElement;
    var defaultView = document.defaultView;
    
    var scrollError;
    var currentPos;
    var currentViewport;
    
    document.ready( function()
    {
        scrollError = CalculateScrollingError();
        currentPos = GetPosition();
        currentViewport = GetViewport();
    
        events.bind( window, 'resize', function()
        {
            OnViewportChange();
        });
            
        events.bind( window, 'scroll', function()
        {
            OnScroll();
            OnViewportChange();
        });
        
        events.bind( window, 'scrollstart', function()
        {
            documentElement.classList.add( 'scrolling' );
        });
        
        events.bind( window, 'scroll-x', function( e )
        {
            OnScrollAxis( 'x', e.dir );
        });
        
        events.bind( window, 'scroll-y', function( e )
        {
            OnScrollAxis( 'y', e.dir );
        });
        
        events.bind( window, 'viewport', function( event )
        {
            UpdateViewport( event );
        });
        
        events.bind( window, 'scrollend', function()
        {
            documentElement.classList.remove( 'scrolling' );
            
            OnScrollAxis( 'x', false );
            OnScrollAxis( 'y', false );
        });
        
        InitViewport();
    });
    
    function OnScroll()
    {
        var newPos = GetPosition();
        
        var isHorizontal = ( currentPos.x != newPos.x );
        var isVertical = ( currentPos.y != newPos.y );
        
        AnnounceActivity();
        
        if( isHorizontal )
        {
            events.trigger( window, 'scroll-x',
            {
                dir: ( newPos.x > currentPos.x ? 'right' : 'left' ),
                dist: ( newPos.x - currentPos.x )
            });
        }
        
        if( isVertical )
        {
            events.trigger( window, 'scroll-y',
            {
                dir: ( newPos.y > currentPos.y ? 'down' : 'up' ),
                dist: ( newPos.y - currentPos.y )
            });
        }
        
        currentPos = newPos;
    };
    
    function OnScrollAxis( axis, dir )
    {
        var dirAttr = ( 'scroll' + axis.toUpperCase() + 'Dir' );
        
        if( dir !== false )
        {
            dataset.set( documentElement, dirAttr, dir );
        }
        else
        {
            dataset.remove( documentElement, dirAttr );
        }
    };
    
    function OnViewportChange()
    {
        var newViewport = GetViewport();
        var eventData =
        {
            viewport: newViewport
        };
        
        if( currentViewport.atLeft != newViewport.atLeft )
        {
            eventData.left = newViewport.atLeft;
        }
        
        if( currentViewport.atRight != newViewport.atRight )
        {
            eventData.right = newViewport.atRight;
        }
        
        if( currentViewport.atTop != newViewport.atTop )
        {
            eventData.top = newViewport.atTop;
        }
        
        if( currentViewport.atBottom != newViewport.atBottom )
        {
            eventData.bottom = newViewport.atBottom;
        }
        
        events.trigger( window, 'viewport', eventData );
        
        currentViewport = newViewport;
    };
    
    function InitViewport()
    {
        UpdateViewport(
        {
            top: currentViewport.atTop,
            bottom: currentViewport.atBottom,
            left: currentViewport.atLeft,
            right: currentViewport.atRight
        });
    };
    
    function UpdateViewport( state )
    {
        Update( 'top' );
        Update( 'bottom' );
        Update( 'left' );
        Update( 'right' );
        
        function Update( dir )
        {
            var limitReached = state[ dir ];
            
            if( limitReached !== undefined )
            {
                var className = 'scroll-' + dir;
                
                if( limitReached )
                {
                    documentElement.classList.add( className );
                }
                else
                {
                    documentElement.classList.remove( className );
                }
            }
        };
    };
    
    var GetPosition;
    
    if( 'scrollX' in defaultView )
    {
        GetPosition = function()
        {
            var ret =
            {
                x: defaultView.scrollX,
                y: defaultView.scrollY
            };
            return ret;
        };
    }
    else
    {
        GetPosition = function()
        {
            var ret =
            {
                x: documentElement.scrollLeft,
                y: documentElement.scrollTop
            };
            return ret;
        };
    }
    
    /**
     * Some browsers (Opera for Android) may incorrectly round some
     * of the scrolling-related values. This function determines what
     * those rounding errors are. Used to find out whether the position
     * of a scrollbar is at its edge.
     */
    function CalculateScrollingError()
    {
        var prevPos = GetPosition();
        
        // Scroll to the right bottom edge
        window.scrollTo( 99999, 99999 );
        var edgePos = GetPosition();
        
        var ret =
        {
             x: ( documentElement.scrollWidth -
                  documentElement.clientWidth -
                  edgePos.x ),
             y: ( documentElement.scrollHeight -
                  documentElement.clientHeight -
                  edgePos.y )
        };
        
        // Restore previous scroll position
        window.scrollTo( prevPos.x, prevPos.y );
        
        return ret;
    };
    
    /**
     * Returns information on current viewport.
     */
    function GetViewport()
    {
        var scrollPos = GetPosition();
        
        var ret =
        {
            top: scrollPos.y,
            height: documentElement.clientHeight,
            left: scrollPos.x,
            width: documentElement.clientWidth
        };
        
        ret.bottom = ret.top + ret.height;
        ret.right = ret.left + ret.width;
        ret.atTop = ( ret.top == 0 );
        ret.atBottom = ( ret.bottom >= ( documentElement.scrollHeight - scrollError.y ) );
        ret.atLeft = ( ret.left == 0 );
        ret.atRight = ( ret.right >= ( documentElement.scrollWidth - scrollError.x ) );
        
        return ret;
    };
    
    var activityTimer;
    
    function AnnounceActivity()
    {
        if( activityTimer === undefined )
        {
            events.trigger( window, 'scrollstart' );
        }
        else
        {
            clearTimeout( activityTimer );
        }
        
        activityTimer = setTimeout
        (
            function()
            {
                events.trigger( window, 'scrollend' );
                activityTimer = undefined;
            },
            scrollingActivityDuration
        );
    };
    
    /**
     * Scrolls target element into current view using scrolling
     * animation. Animation is controlled by smoothScroll* settings.
     */
    function SmoothScrollIntoView( elem, options )
    {
        options = SmoothScrollIntoView.options.mergeSkel( options );
        
        var rect = elem.getBoundingClientRect();
        var offsetX = rect.left;
        var offsetY = rect.top;
        
        if( options.marginLeft !== undefined )
        {
            offsetX += options.marginLeft;
        }
        
        if( options.marginTop !== undefined )
        {
            offsetY += options.marginTop;
        }
        
        SmoothScrollBy( offsetX, offsetY );
    };
    
    SmoothScrollIntoView.options =
    {
        marginLeft: undefined,
        marginTop: undefined
    };
    
    var smoothScrollTimeout;
    
    /**
     * Simulates a single smooth scrolling frame.
     */
    function SmoothScrollTo( x, y )
    {
        if( smoothScrollTimeout !== undefined )
        {
            clearTimeout( smoothScrollTimeout );
            smoothScrollTimeout = undefined;
        }
        
        var scrollWidth = documentElement.scrollWidth;
        var scrollHeight = documentElement.scrollHeight;
        
        var scrollWidthMax = ( scrollWidth - currentViewport.width );
        var scrollHeightMax = ( scrollHeight - currentViewport.height );
        
        if( x < 0 )
        {
            x = 0;
        }
        else if( x > scrollWidthMax )
        {
            x = scrollWidthMax;
        }
        
        if( y < 0 )
        {
            y = 0;
        }
        else if( y > scrollHeightMax )
        {
            y = scrollHeightMax;
        }
        
        var diffWidth = ( x - currentPos.x );
        var diffHeight = ( y - currentPos.y );
        
        var scrollXBy = Math.floor( diffWidth / smoothScrollStepFactor );
        var scrollYBy = Math.floor( diffHeight / smoothScrollStepFactor );
        
        if( scrollXBy.abs > smoothScrollMaxStep )
        {
            scrollXBy = ( smoothScrollMaxStep * scrollXBy.sign );
        }
        
        if( scrollYBy.abs > smoothScrollMaxStep )
        {
            scrollYBy = ( smoothScrollMaxStep * scrollYBy.sign );
        }
        
        if( ( scrollXBy == 0 ) && ( scrollYBy == 0 ) )
        {
            window.scrollTo( x, y );
            return;
        }
        
        window.scrollBy( scrollXBy, scrollYBy );
        
        // Better solution is to use window.requestAnimationFrame().
        smoothScrollTimeout = setTimeout
        (
            function()
            {
                SmoothScrollTo( x, y );
            },
            smoothScrollStepDelay
        );
    };
    
    function SmoothScrollBy( x, y )
    {
        SmoothScrollTo( currentPos.x + x, currentPos.y + y );
    };
    
    var exposedAPI = {};
    
    Object.defineProperties( exposedAPI,
    {
        scrollTo:
        {
            value: SmoothScrollTo
        },
        
        scrollBy:
        {
            value: SmoothScrollBy
        },
        
        scrollIntoView:
        {
            value: SmoothScrollIntoView
        },
        
        viewport:
        {
            get: function()
            {
                return GetViewport();
            }
        },
        
        position:
        {
            get: function()
            {
                return GetPosition();
            }
        }
    });
    
    Object.defineProperty( api, 'scrolling',
    {
        value: exposedAPI
    });
    
})( window );