/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function()
{
    // Document.prototype.write
    (function()
    {
        console.assert( document.readyState === "loading" );
        
        document.write( '<script type="text/javascript">' +
                        '/*<![CDATA[*/' +
                            'document.__writeWorks = true;' +
                        '/*]]>*/' +
                        '</script>' );
        
        console.assert( '__writeWorks' in document );
        console.assert( document.__writeWorks === true );
        
        delete document.__writeWorks;
    })();
    
})();