/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function( api )
{
    var Request = api.Request;
    
    var PostXML = Request.derive(
    {
        constr: function( xml )
        {
            Request.call( this );
            
            this.method = 'POST';
            this.headers.add( 'Content-Type', 'application/xml' );
            
            if( xml !== undefined )
            {
                if( !( xml instanceof String ) )
                {
                    var serializer = new XMLSerializer;
                    xml = '<?xml version="1.0" encoding="UTF-8"?>' +
                          serializer.serializeToString( xml );
                }
                
                this.content = xml;
            }
        }
    });
    
    Object.defineProperty( api, 'PostXML',
    {
        value: PostXML
    });
    
})( requests );