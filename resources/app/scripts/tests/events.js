/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function()
{
    var listener = new events.Listener;
    
    var Handler1, Handler2, Handler3, Handler4_1, Handler4_2;
    
    events.bind( listener, 'test1', Handler1 = function( ev )
    {
        console.assert( ev instanceof Event );
        console.assert( !ev.defaultPrevented );
        console.assert( !ev.propagationStopped );
        console.assert( !ev.immediatePropagationStopped );
        
        ev.preventDefault();
        
        console.assert( ev.defaultPrevented );
    });
    
    events.bind( listener, 'test2', Handler2 = function( ev )
    {
        console.assert( ev instanceof Event );
        console.assert( !ev.defaultPrevented );
        console.assert( !ev.propagationStopped );
        console.assert( !ev.immediatePropagationStopped );
        
        ev.stopPropagation();
        
        console.assert( ev.propagationStopped );
    });
    
    events.bind( listener, 'test3', Handler3 = function( ev )
    {
        console.assert( ev instanceof Event );
        console.assert( !ev.defaultPrevented );
        console.assert( !ev.propagationStopped );
        console.assert( !ev.immediatePropagationStopped );
        
        ev.stopImmediatePropagation();
        
        console.assert( ev.immediatePropagationStopped );
    });
    
    events.bind( listener, 'test4', Handler4_1 = function( ev )
    {
        console.assert( ev instanceof Event );
        console.assert( !ev.defaultPrevented );
        console.assert( !ev.propagationStopped );
        console.assert( !ev.immediatePropagationStopped );
        
        ev.stopImmediatePropagation();
        
        console.assert( ev.immediatePropagationStopped );
    });
    
    events.bind( listener, 'test4', Handler4_2 = function( ev )
    {
        console.assert( ev instanceof Event );
        console.assert( !ev.defaultPrevented );
        console.assert( !ev.propagationStopped );
        console.assert( ev.immediatePropagationStopped );
        
        ev.preventDefault();
        
        console.assert( ev.immediatePropagationStopped );
        console.assert( ev.defaultPrevented );
    });
    
    var ev = events.trigger( listener, 'test1' );
    console.assert( ev.defaultPrevented );
    console.assert( !ev.propagationStopped );
    console.assert( !ev.immediatePropagationStopped );
    
    var ev = events.trigger( listener, 'test2' );
    console.assert( !ev.defaultPrevented );
    console.assert( ev.propagationStopped );
    console.assert( !ev.immediatePropagationStopped );
    
    var ev = events.trigger( listener, 'test3' );
    console.assert( !ev.defaultPrevented );
    console.assert( !ev.propagationStopped );
    console.assert( ev.immediatePropagationStopped );
    
    var ev = events.trigger( listener, 'test4' );
    console.assert( !ev.defaultPrevented );
    console.assert( !ev.propagationStopped );
    console.assert( ev.immediatePropagationStopped );
    
    events.unbind( listener, 'test4', Handler4_2 );
    events.unbind( listener, 'test4', Handler4_1 );
    events.unbind( listener, 'test3', Handler3 );
    events.unbind( listener, 'test2', Handler2 );
    events.unbind( listener, 'test1', Handler1 );
    
})();