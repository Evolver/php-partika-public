/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 * 
 * Implements common API for cross-browser-compatible event handling
 * and event system for custom (non-DOM) use cases.
 * 
 * Idea behind the API:
 *  1) uniform initialization of Event object;
 *  2) uniform event binding across DOM and non-DOM objects;
 *  3) uniform event triggering.
 */

(function( api )
{
    /**
     * Anvent object that represents a cross-browser-compatible
     * DOM or custom events.
     * 
     * @note
     *  This is not the object that is passed to event handlers. Event
     *  handlers still receive browser-native event object.
     */
    var Event = Object.derive(
    {
        constr: function( name )
        {
            Object.defineProperty( this, 'name',
            {
                value: name
            });
        },
        proto: function( proto )
        {
            Object.defineProperties( proto,
            {
                name:
                {
                    configurable: true,
                    value: undefined
                },
                
                makeNative:
                {
                    /**
                     * Returns browser-native event object (most likely
                     * a DOM Event object, but it depends on browser being
                     * used) that can be passed to browser's native event
                     * APIs.
                     * 
                     * @returns
                     *  {Object}
                     */
                    value: function()
                    {
                        var ev = document.createEvent( 'Event' );
                        ev.initEvent( this.name, this.bubbles, this.cancelable );
                        
                        PatchNativeEvent( ev );
                        
                        return ev;
                    }
                }
            });
        }
    });
    
    /**
     * Event listener: binds event handlers to specific events and executes
     * those handlers when an event is fired.
     * 
     * @todo
     *  Support for capture phases.
     */
    var Listener = Object.derive(
    {
        constr: function()
        {
            // list of event handlers that are bound to specific
            // event names
            Object.defineProperty( this, 'events',
            {
                value: {}
            });
        },
        proto: function( proto )
        {
            Object.defineProperties( proto,
            {
                addEventListener:
                {
                    /**
                     * Adds event listener.
                     * 
                     * @param name
                     *  Name of event to bind the listed event handlers to.
                     * 
                     * @param handler
                     *  Event handler to bind.
                     * 
                     * @param capture
                     *  Whether to bind to a capture phase (boolean).
                     * 
                     * @note
                     *  Capture phases are not supported by this implementation.
                     *  "capture" argument is present in the API just for compatibility
                     *  with DOM EventListener IDL.
                     */
                    value: function( name, handler, capture )
                    {
                        console.assert( !capture, 'Capture events not supported' );
                        
                        if( this.events[ name ] === undefined )
                        {
                            this.events[ name ] = [ handler ];
                        }
                        else
                        {
                            console.assert( this.events[ name ].indexOf( handler ) === -1, 'Duplicate event handler' );
                            
                            this.events[ name ].push( handler );
                        }
                    }
                },
                
                removeEventListener:
                {
                    /**
                     * Removes (unbinds) previously bound event handlers.
                     * 
                     * @param name
                     *  Name of event to unbind the handlers from.
                     * 
                     * @param handler
                     *  Event handler to unbind.
                     * 
                     * @param capture
                     *  Whether to unbind from capture phase (boolean).
                     * 
                     * @note
                     *  Capture phases are not supported by this implementation.
                     *  "capture" argument is present in the API just for compatibility
                     *  with DOM EventListener IDL.
                     */
                    value: function( name, handler, capture )
                    {
                        console.assert( !capture, 'Capture events not supported' );
                        console.assert( this.events[ name ] !== undefined, 'No event handlers bound' );
                        
                        var idx = this.events[ name ].indexOf( handler );
                        console.assert( idx !== -1, 'Event handler not bound' );
                        
                        this.events[ name ].splice( idx, 1 );
                        
                        if( this.events[ name ].length == 0)
                        {
                            delete this.events[ name ];
                        }
                    }
                },
                
                dispatchEvent:
                {
                    /**
                     * Dispatches (triggers) an event.
                     * 
                     * @param ev
                     *  Event to dispatch.
                     * 
                     * @returns
                     *  True if default action has not been prevented during event dispatch.
                     *  False if default action has been prevented by at least one of the
                     *  bound event handlers.
                     */
                    value: function( ev )
                    {
                        var handlers = this.events[ ev.type ];
                        var ret;
                        
                        if( handlers !== undefined )
                        {
                            for( var i = 0; i < handlers.length; ++i )
                            {
                                handlers[ i ].call( undefined, ev );
                                
                                if( ev.immediatePropagationStopped )
                                {
                                    break;
                                }
                            }
                            
                            ret = ev.defaultPrevented;
                        }
                        else
                        {
                            ret = true;
                        }
                        
                        return ret;
                    }
                }
            });
        }
    });
    
    /**
     * Patches (adjusts) browser-native event object's API to
     * include advanced features that this custom event API
     * script implements.
     */
    function PatchNativeEvent( ev )
    {
        Object.defineProperty( ev, 'defaultPrevented',
        {
            configurable: true,
            // Should use accessor descriptor here. Otherwise,
            // Chrome and IE9 don't behave well (unit tests will fail).
            // Probably this has something to do with the defaultPrevented
            // being already defined in DOM Leve 3 Event IDL.
            get: function()
            {
                return false;
            }
        });
        
        Object.defineProperty( ev, 'propagationStopped',
        {
            configurable: true,
            value: false
        });
        
        Object.defineProperty( ev, 'immediatePropagationStopped',
        {
            configurable: true,
            value: false
        });
        
        // override stopPropagation()
        (function()
        {
            var orig = ev.stopPropagation;
            
            Object.defineProperty( ev, 'stopPropagation',
            {
                value: function()
                {
                    if( this.propagationStopped )
                    {
                        return;
                    }
                    
                    orig.apply( this, arguments );
                    
                    Object.defineProperty( this, 'propagationStopped',
                    {
                        configurable: false,
                        value: true
                    });
                }
            });
        })();
        
        // override stopImmediatePropagation()
        (function()
        {
            var orig = ev.stopImmediatePropagation;
            
            Object.defineProperty( ev, 'stopImmediatePropagation',
            {
                value: function()
                {
                    if( this.immediatePropagationStopped )
                    {
                        return;
                    }
                    
                    orig.apply( this, arguments );
                    
                    Object.defineProperty( this, 'immediatePropagationStopped',
                    {
                        configurable: false,
                        value: true
                    });
                }
            });
        })();
        
        // override preventDefault()
        (function()
        {
            var orig = ev.preventDefault;
            
            Object.defineProperty( ev, 'preventDefault',
            {
                value: function()
                {
                    if( this.defaultPrevented )
                    {
                        return;
                    }
                    
                    orig.apply( this, arguments );
                    
                    Object.defineProperty( ev, 'defaultPrevented',
                    {
                        configurable: false,
                        get: function()
                        {
                            return true;
                        }
                    });
                }
            });
        })();
    };
    
    /**
     * Binds event handler(s) to the specified element (object)
     * that is compatible with DOM EventListener IDL.
     * 
     * @param elem
     *  Element to bind handler(s) to.
     * 
     * @param eventName
     *  Name of event to bind handler(s) to.
     * 
     * @param handler
     *  One or more event handlers to bind.
     * 
     * @param capture
     *  Bind to capture phase?
     * 
     * @todo
     *  List of elements in "elem".
     *  List of events in "eventName".
     */
    function Bind( elem, eventName, handler, capture )
    {
        if( eventName instanceof Array )
        {
            eventName.forEach( function( eventName )
            {
                Bind( elem, eventName, handler );
            });
            return;
        }
        
        if( handler instanceof Array )
        {
            handler.forEach( function( handler )
            {
                Bind( elem, eventName, handler );
            });
            return;
        }
        
        elem.addEventListener( eventName, handler, capture );
    };
    
    /**
     * Shorthand for Bind(4) with "capture" argument set to true.
     * 
     * @copydoc {Bind}
     */
    function BindCapture( elem, eventName, handler )
    {
        Bind( elem, eventName, handler, true );
    };
    
    /**
     * Unbinds event handler(s) from an element (object)
     * that is compatible with DOM EventListener IDL.
     * 
     * @param elem
     *  Element to unbind event handler from.
     * 
     * @param eventName
     *  Name of event to unbind the handler from.
     * 
     * @param handler
     *  One or more handlers to unbind from the element.
     * 
     * @param capture
     *  Unbind from capture phase?
     * 
     * @todo
     *  List of elements in "elem".
     *  List of events in "eventName" or undefined if to unbind
     *      from all events.
     *  Undefined in "handler" to unbind all handlers.
     */
    function Unbind( elem, eventName, handler, capture )
    {
        if( eventName instanceof Array )
        {
            eventName.forEach( function( eventName ) {
                Unbind( elem, eventName, handler );
            });
            return;
        }
        
        if( handler instanceof Array )
        {
            handler.forEach( function( handler ) {
                Unbind( elem, eventName, handler );
            });
            return;
        }
        
        elem.removeEventListener( eventName, handler, capture );
    };
    
    /**
     * Shorthand for Unbind(4) with "capture" argument set to true.
     * 
     * @copydoc {Unbind}
     */
    function UnbindCapture( elem, eventName, handler, capture )
    {
        Unbind( elem, eventName, handler, true );
    };
    
    /**
     * Creates new event object.
     * 
     * @returns
     *  {Event}
     */
    function CreateEvent( name )
    {
        return new Event( name );
    };
    
    /**
     * Triggers event on an element.
     * 
     * @param elem
     *  Element to trigger the event on.
     * 
     * @param ev
     *  Event to trigger.
     *  
     * @param props
     *  Additional properties to define on the object.
     * 
     * @returns
     *  Native browser event object (with patches applied
     *  by PatchNativeEvent()) that was used to trigger
     *  the events.
     * 
     * @note
     *  "ev" argument is always normalized to browser-native
     *  event object.
     */
    function Trigger( elem, ev, props )
    {
        var eventObj;
        
        if( ev.constructor === String )
        {
            // normalize name of event to browser-native
            // event object
            eventObj = CreateEvent( ev ).makeNative();
        }
        else if( ev instanceof Event )
        {
            // normalize custom event object to browser-native
            // event object
            eventObj = ev.makeNative();
        }
        else if( ev instanceof api.Event )
        {
            // already a native event object
            eventObj = ev;
        }
        else
        {
            console.assert( false, 'Unsupported event object type ' + ev );
            return undefined;
        }
        
        if( props !== undefined )
        {
            if( props instanceof Function )
            {
                props( eventObj );
            }
            else
            {
                for( var prop in props )
                {
                    Object.defineProperty( eventObj, prop,
                    {
                        value: props[ prop ]
                    });
                }
            }
        }
        
        elem.dispatchEvent( eventObj );
        return eventObj;
    };
    
    /**
     * Expose custom event API to the "outside world".
     */
    var exposedAPI =
    {
        create: CreateEvent,
        bind: Bind,
        bindCapture: BindCapture,
        unbind: Unbind,
        unbindCapture: UnbindCapture,
        trigger: Trigger,
        Event: Event,
        Listener: Listener
    };
    
    Object.seal( exposedAPI );
    
    /**
     * NOTE: used to export as "event", but does not work in GT-P5100's native browser.
     * Failing user agent: "Mozilla/5.0 AppleWebKit/534.30 Version/4.0 Safari/534.30".
     */
    Object.defineProperty( api, 'events',
    {
        value: exposedAPI
    });
    
})( window );
