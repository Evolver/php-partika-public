/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function()
{
    // Function.prototype.derive()
    (function()
    {
        var Parent = Array;
        
        function Constructor()
        {
            this.counter = 1;
        };
        
        var Child = Parent.derive(
        {
            constr: Constructor,
            proto: function( proto, parent )
            {
                console.assert( parent === Parent.prototype );
                
                proto.x = 5;
                proto.y = 10;
                
                proto.testMethod = function()
                {
                    console.assert( this.x === 5 );
                    console.assert( this.y === 10 );
                    
                    return ++this.counter;
                };
            }
            
        });
        
        var c = new Child;
        
        console.assert( c instanceof Child );
        console.assert( c instanceof Parent );
        console.assert( !c.hasOwnProperty( 'x' ) );
        console.assert( !c.hasOwnProperty( 'y' ) );
        console.assert( c.x === 5 );
        console.assert( c.y === 10 );
        console.assert( !c.hasOwnProperty( 'constructor' ) );
        console.assert( c.constructor === Child );
        console.assert( !c.hasOwnProperty( 'parent' ) );
        console.assert( c.hasOwnProperty( 'counter' ) );
        console.assert( c.counter === 1 );
        console.assert( c.testMethod() === 2 );
        console.assert( c.counter === 2 );
        
        var GrandChild = Child.derive(
        {
            constr: function( counter )
            {
                Child.call( this );
                
                console.assert( this.counter === 1 );
                
                this.counter = counter;
            },
            proto: function( proto, parent )
            {
                console.assert( parent === Child.prototype );
                
                proto.testMethod = function( val )
                {
                    return this.counter = parent.testMethod.call( this ) + 1;
                }
            }
        });
        
        var gc = new GrandChild( 5 );
        
        console.assert( gc.counter === 5 );
        console.assert( gc.testMethod() === 7 );
        console.assert( gc.counter === 7 );
        
    })();
    
    // Function.prototype.isConstructorOf()
    (function()
    {
        function CustomFn() { };
        var DerivedFn = CustomFn.derive();
        
        var undefVar;
        var obj = {};
        var fn = new Function;
        var customFn = new CustomFn;
        var derivedFn = new DerivedFn;
        
        console.assert( Object.isConstructorOf( undefined ) === false );
        console.assert( Object.isConstructorOf( undefVar ) === false );
        console.assert( Object.isConstructorOf( 5 ) === false );
        console.assert( Object.isConstructorOf( true ) === false );
        console.assert( Object.isConstructorOf( 5.5 ) === false );
        
        console.assert( Object.isConstructorOf( obj ) );
        
        console.assert( Object.isConstructorOf( fn ) === false );
        console.assert( Function.isConstructorOf( fn ) );
        
        console.assert( Object.isConstructorOf( customFn ) === false );
        console.assert( Function.isConstructorOf( customFn ) === false );
        console.assert( CustomFn.isConstructorOf( customFn ) );
        
        console.assert( Object.isConstructorOf( derivedFn ) === false );
        console.assert( Function.isConstructorOf( derivedFn ) === false );
        console.assert( CustomFn.isConstructorOf( derivedFn ) === false );
        console.assert( DerivedFn.isConstructorOf( derivedFn ) );
        
    })();
    
})();