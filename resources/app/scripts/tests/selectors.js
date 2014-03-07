/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function()
{
    // String.prototype.splitSelectors()
    (function()
    {
        console.assert( " div ".splitSelectors().length == 1 );
        console.assert( " div ".splitSelectors()[ 0 ] == "div" );
        console.assert( " div , a ".splitSelectors().length == 2 );
        console.assert( " div , a ".splitSelectors()[ 0 ] == "div" );
        console.assert( " div , a ".splitSelectors()[ 1 ] == "a" );
        /**
         * Known to fail due to comma in the attribute, but these are rare
         * cases and will not be addressed for the moment. Otherwise, a CSS parser
         * or complex regexp needs to be developed to address the problem.
        console.assert( " div[x=\"4,5\"] , a ".splitSelectors().length == 2 );
        console.assert( " div[x=\"4,5\"] , a ".splitSelectors()[ 0 ] == "div" );
        console.assert( " div[x=\"4,5\"] , a ".splitSelectors()[ 1 ] == "a" );
        */
    })();
    
    // String.prototype.transformChildSelector()
    (function()
    {
        console.assert( " > div ".transformChildSelector( "test" ) == "#test > div" );
        console.assert( ">div ".transformChildSelector( "test" ) == "#test >div" );
        console.assert( "> div ".transformChildSelector( "test" ) == "#test > div" );
        console.assert( " >> div ".transformChildSelector( "test" ) == "#test >> div" );
        console.assert( "  div ".transformChildSelector( "test" ) == "#test div" );
    })();
    
    // String.prototype.transformChildSelectors()
    (function()
    {
        console.assert( ">el,>el2".transformChildSelectors( "test" ) == "#test >el,#test >el2" );
        console.assert( " >el,>el2 ".transformChildSelectors( "test" ) == "#test >el,#test >el2" );
        console.assert( " > el,>el2 ".transformChildSelectors( "test" ) == "#test > el,#test >el2" );
        console.assert( " > el, >el2 ".transformChildSelectors( "test" ) == "#test > el,#test >el2" );
        console.assert( " > el, > el2 ".transformChildSelectors( "test" ) == "#test > el,#test > el2" );
        console.assert( "  el,  el2 ".transformChildSelectors( "test" ) == "#test el,#test el2" );
        /**
         * Known to fail. Related to the issue above.
        console.assert( " > el[x=\"4,5\"], > el2 ".transformChildSelectors( "test" ) == "#test > el,#test > el2" );
        */
    })();
    
    // Array.prototype.joinSelectors()
    (function()
    {
        console.assert( ["div","b"].joinSelectors() == "div,b" );
        console.assert( ["","b"].joinSelectors() == ",b" );
        console.assert( ["",""].joinSelectors() == "," );
        console.assert( [""].joinSelectors() == "" );
    })();
    
    // $$
    (function()
    {
        var div = document.createElement( 'div' );
        div.innerHTML =
            "<div type=\"first\">" +
                "<h1 class=\"title\">Title</h1>" +
                "<p data-type=\"paragraph\">Paragraph <b>bold</b> or <i>italic</i> te<i>x</i>t</p>" +
                "<div type=\"second\"></div>" +
            "</div>";
        
        var frag = document.createDocumentFragment();
        frag.appendChild( div.firstChild );
        
        console.assert( $$( 'div', frag ).length == 2 );
        console.assert( attr.get( $$( 'div', frag )[ 0 ], 'type' ) == 'first' );
        console.assert( attr.get( $$( 'div', frag )[ 1 ], 'type' ) == 'second' );
        
        console.assert( $$( '> div', frag ).length == 1 );
        console.assert( attr.get( $$( '> div', frag )[ 0 ], 'type' ) == 'first' );
        
        console.assert( $$( '> div[type="first"] > h1', frag ).length == 1 );
        console.assert( $$( '> div > p b, > div > p i', frag ).length == 3 );
    })();
    
    // $
    (function()
    {
        var div = document.createElement( 'div' );
        div.innerHTML =
            "<div type=\"first\">" +
                "<h1 class=\"title\">Title</h1>" +
                "<p data-type=\"paragraph\">Paragraph <b>bold</b> or <i>italic</i> te<i>x</i>t</p>" +
                "<div type=\"second\"></div>" +
            "</div>";
        
        var frag = document.createDocumentFragment();
        frag.appendChild( div.firstChild );
        
        console.assert( $( 'div', frag ) !== undefined );
        console.assert( attr.get( $( 'div', frag ), 'type' ) == 'first' );
        
        console.assert( $( '> div', frag ) !== undefined );
        console.assert( attr.get( $( '> div', frag ), 'type' ) == 'first' );
        
        console.assert( $( '> div[type="first"] > h1', frag ) !== undefined );
        console.assert( $( '> div > p b, > div > p i', frag ) !== undefined );
    })();
    
})();