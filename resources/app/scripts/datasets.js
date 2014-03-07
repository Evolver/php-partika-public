/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function( api ){
    
    /**
     * Converts camelCase data property name to a
     * dash-separated-prop-name.
     * 
     * @param propName
     *  Camel case data property name to convert.
     *  
     * @returns
     *  Dash-separated data property name.
     */
    function GetDashSeparatedName( propName )
    {
        return 'data-' + propName.replace( /([A-Z])/g, "-$1" ).toLowerCase();
    };
    
    if( 'dataset' in document.documentElement )
    {
        /**
         * Forces browser to redraw the element.
         * 
         * @param elem
         *  Element to redraw.
         *  
         * @note
         *  This method is used to instantly trigger CSS layout
         *  changes as we add properties on elements. This is required
         *  for buggy browsers than do not always propertly draw
         *  an element if CSS attribute selectors are present.
         */
        function Redraw( elem )
        {
            elem.className = elem.className;
        };
        
        /**
         * Obtains value for the specified data property name.
         * 
         * @param elem
         *  Element to obtain data property from.
         *  
         * @param propName
         *  Camel case property name.
         *  
         * @returns
         *  Value of the property or undefined.
         */
        function GetValue( elem, propName )
        {
            if( propName in elem.dataset )
            {
                return elem.dataset[ propName ];
            }
            else
            {
                return undefined;
            }
        };
        
        /**
         * Sets data property value for the specified element.
         * 
         * @param elem
         *  Element to set the data property for.
         *  
         * @param propName
         *  Camel case property name of the data element.
         *  
         * @param value
         *  Value of the property.
         */
        function SetValue( elem, propName, value )
        {
            elem.dataset[ propName ] = value;
            Redraw( elem );
        };
        
        /**
         * Checks if specified data attribute is set on an element.
         * 
         * @param elem
         *  Element to check.
         *  
         * @param propName
         *  Property name to check.
         *  
         * @return
         *  True if data property is present. False otherwise.
         */
        function HasValue( elem, propName )
        {
            return propName in elem.dataset;
        };
        
        /**
         * Removes data property from the element.
         * 
         * @param elem
         *  Element to remove data attribute from.
         *  
         * @param propName
         *  Camel case name of the data property to remove.
         */
        function RemoveValue( elem, propName )
        {
            delete elem.dataset[ propName ];
            Redraw( elem );
        };
    }
    else
    {
        /**
         * Obtains value for the specified data property name.
         * 
         * @param elem
         *  Element to obtain data property from.
         *  
         * @param propName
         *  Camel case property name.
         *  
         * @returns
         *  Value of the property or undefined.
         */
        function GetValue( elem, propName )
        {
            return attr.get( elem, GetDashSeparatedName( propName ) );
        };
        
        /**
         * Sets data property value for the specified element.
         * 
         * @param elem
         *  Element to set the data property for.
         *  
         * @param propName
         *  Camel case property name of the data element.
         *  
         * @param value
         *  Value of the property.
         */
        function SetValue( elem, propName, value )
        {
            return attr.set( elem, GetDashSeparatedName( propName ), value );
        };
        
        /**
         * Checks if specified data attribute is set on an element.
         * 
         * @param elem
         *  Element to check.
         *  
         * @param propName
         *  Property name to check.
         *  
         * @return
         *  True if data property is present. False otherwise.
         */
        function HasValue( elem, propName )
        {
            return attr.has( elem, GetDashSeparatedName( propName ) );
        };
        
        /**
         * Removes data property from the element.
         * 
         * @param elem
         *  Element to remove data attribute from.
         *  
         * @param propName
         *  Camel case name of the data property to remove.
         */
        function RemoveValue( elem, propName )
        {
            return attr.remove( elem, GetDashSeparatedName( propName ) );
        };
    }
    
    var exposedAPI =
    {
        get: GetValue,
        set: SetValue,
        has: HasValue,
        remove: RemoveValue
    };
    
    Object.seal( exposedAPI );
    
    Object.defineProperty( api, 'dataset', {
        value: exposedAPI
    });
    
})( window );