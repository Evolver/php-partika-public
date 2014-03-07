/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function( api )
{
    var Request = api.Request;
    
    var PostForm = Request.derive(
    {
        constr: function( args )
        {
            Request.call( this );
            
            this.method = 'POST';
            this.headers.add( 'Content-Type', 'application/x-www-form-urlencoded' );
            this.content = MakeFormBody( args );
        }
    });
    
    function MakeFormBody( args )
    {
        var argList = [];
        
        if( args instanceof Array )
        {
            args.forEach( function( arg )
            {
                AddArg( arg.name, arg.value );
            });
        }
        else
        {
            for( var argName in args )
            {
                AddArg( argName, args[ argName ] );
            }
        }
        
        function AddArg( name, value )
        {
            argList.push( encodeURIComponent( name ) + '=' + encodeURIComponent( value ) );
        };
        
        return argList.join( '&' );
    };
    
    Object.defineProperty( api, 'PostForm',
    {
        value: PostForm
    });
    
})( requests );