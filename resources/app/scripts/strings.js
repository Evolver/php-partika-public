/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

Object.defineProperties( String.prototype,
{
    toFormattedNumberString:
    {
        /**
         * Returns number as string with decimal and thousand separators in place.
         * 
         * @param string decimalSeparator
         *  If undefined, '.' to be used as default.
         *  
         * @param string thousandSeparator
         *  If undefined, ',' to be used as default.
         * 
         * @return string
         */
        value: function( decimalSeparator, thousandSeparator )
        {
            if( decimalSeparator === undefined )
            {
                decimalSeparator = '.';
            }
            
            if( thousandSeparator === undefined )
            {
                thousandSeparator = ',';
            }
            
            var parts = this.split( '.' );
            var integral = parts[ 0 ];
            var fractional;
            
            if( parts.length > 1 )
            {
                fractional = parts[ 1 ];
            }
            
            if( integral.length <= 3 )
            {
                var ret = integral;
                
                if( fractional !== undefined )
                {
                    ret += decimalSeparator + fractional;
                }
                
                return ret;
            }
            
            var formatted = '';
            
            var extraDigitsAtStart = ( integral.length % 3 );
            if( extraDigitsAtStart > 0 )
            {
                formatted = integral.substr( 0, extraDigitsAtStart ) + thousandSeparator;
                integral = integral.substr( extraDigitsAtStart );
            }
            
            formatted += integral.match( /\d{3}/g ).join( thousandSeparator );
            
            if( fractional !== undefined )
            {
                formatted += decimalSeparator + fractional;
            }
            
            return formatted;
        }
    }
});