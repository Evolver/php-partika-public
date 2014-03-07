/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function()
{
    // Object.prototype.hasOwnProperties()
    (function()
    {
        var obj =
        {
            a: {},
            b: {
                x: 5
            }
        };
        
        console.assert( obj.hasOwnProperties() );
        console.assert( !obj.a.hasOwnProperties() );
        console.assert( obj.b.hasOwnProperties() );
    })();
    
    // Object.prototype.clonable
    (function()
    {
        function DummyFn(){};
        
        console.assert( ({}).clonable );
        console.assert( ([]).clonable );
        console.assert( (5).clonable );
        console.assert( ("").clonable );
        console.assert( (true).clonable );
        console.assert( !(DummyFn).clonable );
    })();
    
    // Object.prototype.clone()
    (function()
    {
        function DummyFn(){};
        
        var obj =
        {
            x: 5,
            y: 10,
            z: undefined,
            fn: DummyFn,
            o: {
                a: 1,
                b: 2
            }
        };
        
        var cloned = obj.clone(); 
        
        console.assert( cloned !== obj );
        console.assert( cloned.constructor === obj.constructor );
        console.assert( cloned instanceof obj.constructor );
        console.assert( cloned.x !== undefined );
        console.assert( cloned.y !== undefined );
        console.assert( cloned.fn !== undefined );
        console.assert( cloned.hasOwnProperty( 'z' ) );
        console.assert( cloned.x === obj.x );
        console.assert( cloned.y === obj.y );
        console.assert( cloned.fn === obj.fn );
        console.assert( cloned.fn === DummyFn );
        console.assert( cloned.z === obj.z );
        console.assert( cloned.z === undefined );
        console.assert( cloned.o instanceof Object );
        console.assert( cloned.o === obj.o );
        
        obj.x = 6;
        
        console.assert( cloned.x !== obj.x );
        console.assert( cloned.x === 5 );
        console.assert( obj.x === 6 );
        
        var num = 123;
        var str = "123";
        var bool = true;
        var arr = [1,2];
        
        console.assert( num.clone() === 123 );
        console.assert( num.clone() === num );
        console.assert( str.clone() === "123" );
        console.assert( str.clone() === str );
        console.assert( bool.clone() === true );
        console.assert( bool.clone() === bool );
        console.assert( arr.clone() !== arr );
        
    })();
    
    // Object.prototype.writeProps()
    (function()
    {
        function DummyFn(){};
        
        var obj =
        {
            x: 5,
            y: 10,
            z: undefined,
            fn: DummyFn
        };
        
        var obj2 =
        {
            x: 7,
            y: undefined,
            z: {
                a: 1,
                b: 2,
                c: {}
            }
        };
        
        console.assert( obj.writeProps( obj2 ) === obj );
        console.assert( obj.x === 7 );
        console.assert( obj.hasOwnProperty( 'y' ) );
        console.assert( obj.y === undefined );
        console.assert( obj.hasOwnProperty( 'z' ) );
        console.assert( obj.z !== undefined );
        console.assert( obj.z instanceof Object );
        console.assert( obj.z === obj2.z );
        console.assert( obj.z.c === obj2.z.c );
        console.assert( obj.fn instanceof Function );
        console.assert( obj.fn === DummyFn );
        
        obj2.z.a = 2;
        console.assert( obj.z.a === 2 );
    })();
    
    // Object.prototype.deepWrite()
    (function()
    {
        function DummyFn(){};
        
        var obj =
        {
            x: 5,
            y: 10,
            z: undefined,
            fn: DummyFn
        };
        
        var obj2 =
        {
            x: 7,
            y: undefined,
            z: {
                a: 1,
                b: 2,
                c: {}
            }
        };
        
        console.assert( obj.deepWrite( obj2 ) === obj );
        console.assert( obj.x === 7 );
        console.assert( obj.hasOwnProperty( 'y' ) );
        console.assert( obj.y === undefined );
        console.assert( obj.hasOwnProperty( 'z' ) );
        console.assert( obj.z !== undefined );
        console.assert( obj.z instanceof Object );
        console.assert( obj.z !== obj2.z );
        console.assert( obj.z.a === 1 );
        console.assert( obj.z.b === 2 );
        console.assert( obj.z.hasOwnProperty( 'c' ) );
        console.assert( obj.z.c instanceof Object );
        console.assert( obj.z.c !== obj2.z.c );
        console.assert( !obj.z.c.hasOwnProperties() );
        console.assert( obj.fn instanceof Function );
        console.assert( obj.fn === DummyFn );
        
        obj2.z.a = 2;
        console.assert( obj.z.a === 1 );
    })();
    
    // Object.prototype.mergeProps()
    (function()
    {
        function DummyFn(){};
        
        var obj =
        {
            x: 5,
            y: 10,
            z: undefined,
            fn: DummyFn
        };
        
        var obj2 =
        {
            x: 7,
            y: undefined,
            z: {
                a: 1,
                b: 2,
                c: {}
            }
        };
        
        var merged = obj.mergeProps( obj2 );
        
        console.assert( merged !== obj );
        console.assert( merged.x === 7 );
        console.assert( merged.hasOwnProperty( 'y' ) );
        console.assert( merged.y === undefined );
        console.assert( merged.hasOwnProperty( 'z' ) );
        console.assert( merged.z !== undefined );
        console.assert( merged.z instanceof Object );
        console.assert( merged.z === obj2.z );
        console.assert( merged.z.c === obj2.z.c );
        console.assert( merged.fn instanceof Function );
        console.assert( merged.fn === DummyFn );
        
        obj2.z.a = 2;
        console.assert( merged.z.a === 2 );
    })();
    
    // Object.prototype.deepMerge()
    (function()
    {
        function DummyFn(){};
        
        var obj =
        {
            x: 5,
            y: 10,
            z: undefined,
            fn: DummyFn
        };
        
        var obj2 =
        {
            x: 7,
            y: undefined,
            z: {
                a: 1,
                b: 2,
                c: {}
            }
        };
        
        var merged = obj.deepMerge( obj2 );
        
        console.assert( merged !== obj );
        console.assert( merged.x === 7 );
        console.assert( merged.hasOwnProperty( 'y' ) );
        console.assert( merged.y === undefined );
        console.assert( merged.hasOwnProperty( 'z' ) );
        console.assert( merged.z !== undefined );
        console.assert( merged.z instanceof Object );
        console.assert( merged.z !== obj2.z );
        console.assert( merged.z.a === 1 );
        console.assert( merged.z.b === 2 );
        console.assert( merged.z.hasOwnProperty( 'c' ) );
        console.assert( merged.z.c instanceof Object );
        console.assert( merged.z.c !== obj2.z.c );
        console.assert( !merged.z.c.hasOwnProperties() );
        console.assert( merged.fn instanceof Function );
        console.assert( merged.fn === DummyFn );
        
        obj2.z.a = 2;
        console.assert( merged.z.a === 1 );
    })();
    
    // Object.prototype.proxy()
    (function()
    {
        var obj =
        {
            x: 1,
            y: 2,
            z: {
                a: 1,
                b: 2
            },
            testMethod: function()
            {
                return 1;
            }
        };
        
        var proxy = obj.proxy(function( proto, orig )
        {
            proto.testMethod = function()
            {
                return 2 + orig.testMethod();
            };
        });
        
        console.assert( proxy !== obj );
        console.assert( proxy instanceof obj.constructor );
        console.assert( proxy.constructor === obj.constructor );
        console.assert( proxy.x === obj.x );
        console.assert( proxy.y === obj.y );
        console.assert( proxy.z === obj.z );
        console.assert( obj.testMethod() === 1 );
        console.assert( proxy.testMethod() === 3 );
        
        obj.x = 3;
        obj.z.a = 3;
        
        console.assert( proxy.x === 3 );
        console.assert( proxy.z.a === 3 );
        
        proxy.x = 4;
        
        console.assert( proxy.x === 4 );
        console.assert( obj.x === 3 );
    })();
    
    // Object.prototype.writeSkel()
    (function()
    {
        function DummyFn() { };
        
        var obj =
        {
            a: 5,
            b: 10,
            c:
            {
                x: 1,
                y: 2,
                z: undefined
            }
        };
        
        var origNestedObj = obj.c;
        
        var skel =
        {
            a: 6,
            d: 7,
            c:
            {
                x: 3,
                g: 15,
                z: 20,
                m:
                {
                    i: 30
                }
            },
            e: DummyFn
        };
        
        obj.writeSkel( skel );
        
        console.assert( obj.a === 6 );
        console.assert( obj.b === 10 );
        console.assert( obj.d === 7 );
        console.assert( obj.c instanceof Object );
        console.assert( obj.c.constructor === Object );
        console.assert( obj.c !== skel.c );
        console.assert( obj.c === origNestedObj );
        console.assert( obj.c.x === 3 );
        console.assert( obj.c.y === 2 );
        console.assert( obj.c.z === 20 );
        console.assert( obj.c.g === 15 );
        console.assert( obj.c.m instanceof Object );
        console.assert( obj.c.m.constructor === Object );
        console.assert( obj.c.m.i === 30 );
        console.assert( obj.e === DummyFn );
        
    })();
    
    // Object.prototype.mergeSkel()
    (function()
    {
        function DummyFn() { };
        
        var obj =
        {
            a: 5,
            b: 10,
            c:
            {
                x: 1,
                y: 2,
                z: undefined
            }
        };
        
        var skel =
        {
            a: 6,
            d: 7,
            c:
            {
                x: 3,
                g: 15,
                z: 20,
                m:
                {
                    i: 30
                }
            },
            e: DummyFn,
            f:
            {
                x: 10
            }
        };
        
        var result = obj.mergeSkel( skel );
        
        console.assert( result !== obj );
        console.assert( result !== skel );
        console.assert( result.a === 6 );
        console.assert( result.b === 10 );
        console.assert( result.d === 7 );
        console.assert( result.c instanceof Object );
        console.assert( result.c.constructor === Object );
        console.assert( result.c !== skel.c );
        console.assert( result.c !== obj.c );
        console.assert( result.c !== skel.c );
        console.assert( result.c.x === 3 );
        console.assert( result.c.y === 2 );
        console.assert( result.c.z === 20 );
        console.assert( result.c.g === 15 );
        console.assert( result.c.m instanceof Object );
        console.assert( result.c.m.constructor === Object );
        console.assert( result.c.m.i === 30 );
        console.assert( result.e === DummyFn );
        console.assert( result.f === skel.f );

    })();
    
    // Object.prototype.deepMergeSkel()
    (function()
    {
        function DummyFn() { };
        
        var obj =
        {
            a: 5,
            b: 10,
            c:
            {
                x: 1,
                y: 2,
                z: undefined
            }
        };
        
        var skel =
        {
            a: 6,
            d: 7,
            c:
            {
                x: 3,
                g: 15,
                z: 20,
                m:
                {
                    i: 30
                }
            },
            e: DummyFn,
            f:
            {
                x: 10
            }
        };
        
        var result = obj.deepMergeSkel( skel );
        
        console.assert( result !== obj );
        console.assert( result !== skel );
        console.assert( result.a === 6 );
        console.assert( result.b === 10 );
        console.assert( result.d === 7 );
        console.assert( result.c instanceof Object );
        console.assert( result.c.constructor === Object );
        console.assert( result.c !== skel.c );
        console.assert( result.c !== obj.c );
        console.assert( result.c !== skel.c );
        console.assert( result.c.x === 3 );
        console.assert( result.c.y === 2 );
        console.assert( result.c.z === 20 );
        console.assert( result.c.g === 15 );
        console.assert( result.c.m instanceof Object );
        console.assert( result.c.m.constructor === Object );
        console.assert( result.c.m.i === 30 );
        console.assert( result.e === DummyFn );
        console.assert( result.f !== skel.f );

    })();
    
})();