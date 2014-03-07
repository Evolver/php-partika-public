/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

// XHTML XML documents do not support document.write(), document.writeln().
// More info at http://www.w3.org/MarkUp/2004/xhtml-faq#docwrite
// Primary motive behind supporting document.write() is the ability to embed
// Google Maps JavaScript API v3 into XHTML documents. They use document.write()
// to inject script elements.
(function()
{
    /**
     * Parses specified markup and inserts it into the document at current
     * parsing position.
     * 
     * This function shall be called in context of document.
     * 
     * @param markup
     *  Markup to parse.
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/API/document.write
     * 
     * @warning
     *  Use of this method is discouraged and is considered bad practice. It
     *  is implemented only to enable interoperability with scripts not designed
     *  for XHTML.
     */
    function WriteMarkup( markup )
    {
        var frag = dom.parse( markup );
        dom.initScripts( frag );
        
        if( this.readyState !== "loading" )
        {
            console.log( this.readyState );
            console.log( markup );
            throw 'Writing to an already loaded document is not supported';
        }
        
        this.currentElement.parentNode.appendChild( frag );
    };
    
    /**
     * Same as Document.prototype.write() + appends a newline to the end
     * of the markup string.
     * 
     * This function shall be called in context of document.
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/API/document.writeln
     */
    function WriteMarkupLn( markup )
    {
        return this.write( markup + "\n" );
    }
    
    var writeSupported = ( 'write' in Document.prototype );
    
    if( writeSupported )
    {
        // Some browsers define write(), writeln(), open() and close() with an implementation that
        // always throws. Such behavior means the feature is not supported.
        try
        {
            document.write( '' );
        }
        catch( e )
        {
            writeSupported = false;
        }
    }
    
    if( !writeSupported )
    {
        Object.defineProperties( Document.prototype,
        {
            write:
            {
                value: WriteMarkup
            },
            
            writeln:
            {
                value: WriteMarkupLn
            }
        });
        
        // Some browsers will not propagate defineProperty() changes to document object.
        // As a workaround the properties are assigned directly.
        if( document.write !== WriteMarkup )
        {
            document.write = WriteMarkup;
            document.writeln = WriteMarkupLn;
        }
    }
})();

Object.defineProperties( Document.prototype,
{
    currentElement:
    {
        get: function()
        {
            if( this.readyState !== "loading" )
            {
                return null;
            }
            
            if( this.documentElement === null )
            {
                return null;
            }
            
            var ret = this.documentElement;
            
            while( ret.lastElementChild !== null )
            {
                ret = ret.lastElementChild;
            }
            
            return ret;
        }
    },
    
    ready:
    {
        value: function( fn )
        {
            switch( this.readyState )
            {
                case 'interactive':
                case 'complete':
                {
                    fn();
                    break;
                }
                
                default:
                {
                    events.bind( document, 'DOMContentLoaded', fn );
                    break;
                }
            }
        }
    }
});

// defaultView equivalent for Internet Explorer.
// According to http://stackoverflow.com/questions/2297217/ie-8-defaultview-equivalent
if( !( 'defaultView' in document ) )
{
    Object.defineProperty( document, 'defaultView',
    {
        get: function()
        {
            return this.parentWindow;
        }
    });
}
