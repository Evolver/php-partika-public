/**
 * Copyright (C) 2013 Dmitry Stepanov, dmitry@stepanov.lv
 */

(function( api )
{
    var NewXMLHttpRequest;
    
    if( XMLHttpRequest !== undefined )
    {
        NewXMLHttpRequest = function()
        {
            return new XMLHttpRequest;
        };
    }
    else if( ActiveXObject !== undefined )
    {
        NewXMLHttpRequest = function()
        {
            try
            {
                return new ActiveXObject( 'Microsoft.XMLHTTP' );
            }
            catch( e )
            {
                try
                {
                    return new ActiveXObject( 'Msxml2.XMLHTTP' );
                }
                catch( e )
                {
                    throw 'Not supported';
                }
            }
        };
    }
    
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#readyState
    var State =
    {
        UNSENT: 0,
        OPENED: 1,
        HEADERS_RECEIVED: 2,
        LOADING: 3,
        DONE: 4
    };
    Object.seal( State );
    
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#responseType
    var ResponseType =
    {
        STRING: 'text',
        ARRAY_BUFFER: 'arraybuffer',
        BLOB: 'blob',
        DOCUMENT: 'document',
        JSON: 'json'
    };
    Object.seal( ResponseType );
    
    var Headers = Array.derive(
    {
        proto: function( proto )
        {
            Object.defineProperties( proto,
            {
                add:
                {
                    value: function( name, value )
                    {
                        this.push(
                        {
                            name: name,
                            value: value
                        });
                    }
                }
            });
        }
    });
    
    var Request = Object.derive(
    {
        constr: function()
        {
            Object.defineProperties( this,
            {
                events:
                {
                    value: new events.Listener
                },
                
                headers:
                {
                    value: new Headers
                }
            });
        },
        
        proto: function( proto )
        {
            Object.defineProperties( proto,
            {
                req:
                {
                    value: undefined,
                    writable: true
                },
                
                state:
                {
                    get: function()
                    {
                        if( this.req === undefined )
                        {
                            return State.UNSENT;
                        }
                        
                        return this.req.readyState;
                    }
                },
                
                prevState:
                {
                    value: undefined,
                    writable: true
                },
                
                user:
                {
                    value: undefined,
                    writable: true
                },
                
                password:
                {
                    value: undefined,
                    writable: true
                },
                
                url:
                {
                    value: undefined,
                    writable: true
                },
                
                method:
                {
                    value: 'GET',
                    writable: true
                },
                
                content:
                {
                    value: undefined,
                    writable: true
                },
                
                async:
                {
                    value: true,
                    writable: true
                },
                
                timeout:
                {
                    value: undefined,
                    writable: true
                },
                
                isActive:
                {
                    get: function()
                    {
                        switch( this.state )
                        {
                            case State.UNSENT:
                            case State.DONE:
                            {
                                return false;
                            }
                            
                            default:
                            {
                                return true;
                            }
                        }
                    }
                },
                
                isComplete:
                {
                    get: function()
                    {
                        return ( this.state == State.DONE );
                    }
                },
                
                asType:
                {
                    value: undefined,
                    writable: true
                },
                
                asMimeType:
                {
                    value: undefined,
                    writable: true
                },
                
                response:
                {
                    get: function()
                    {
                        console.assert( this.isComplete );
                        
                        var ret = this.req.response;
                        if( ret === null )
                        {
                            ret = undefined;
                        }
                        
                        return ret;
                    }
                },
                
                responseStatus:
                {
                    get: function()
                    {
                        console.assert( this.isComplete );
                        
                        return this.req.status;
                    }
                },
                
                Send:
                {
                    value: function()
                    {
                        console.assert( !this.isActive );
                        console.assert( this.url !== undefined );
                        console.assert( this.method !== undefined );
                        
                        var req = this.req = NewXMLHttpRequest();
                        OnBegin.call( this );
                        
                        try
                        {
                            req.open( this.method, this.url, this.async );
                            req.onreadystatechange = OnReadyStateChange.bind( this );
                            
                            if( this.asType !== undefined )
                            {
                                req.responseType = this.asType;
                            }
                            
                            if( this.asMimeType !== undefined )
                            {
                                req.overrideMimeType( this.asMimeType );
                            }
                            
                            if( this.timeout !== undefined )
                            {
                                req.timeout = this.timeout;
                            }
                            
                            this.headers.forEach( function( header )
                            {
                                req.setRequestHeader( header.name, header.value );
                            });
                            
                            req.send( this.content === undefined ? null : this.content );
                        }
                        catch( e )
                        {
                            OnError.call( this, e );
                            OnComplete.call( this );
                            return;
                        }
                    }
                },
                
                Abort:
                {
                    value: function()
                    {
                        if( !this.isActive )
                        {
                            return;
                        }
                        
                        this.req.abort();
                        OnAbort.call( this );
                        OnComplete.call( this );
                    }
                }
            });
            
            function OnBegin()
            {
                this.prevState = State.UNSENT;
                events.trigger( this.events, 'begin' );
            };
            
            function OnReadyStateChange()
            {
                if( this.prevState === this.state )
                {
                    return;
                }
                
                events.trigger( this.events, 'state' );
                this.prevState = this.state;
                
                if( this.state === State.DONE )
                {
                    if( this.response === undefined )
                    {
                        OnError.call( this, 'Response could not be parsed' );
                    }
                    else
                    {
                        var responseStatus = this.responseStatus;
                        
                        // http://en.wikipedia.org/wiki/List_of_HTTP_status_codes#2xx_Success
                        if( ( responseStatus >= 200 ) && ( responseStatus < 300 ) )
                        {
                            OnSuccess.call( this );
                        }
                        else if( responseStatus == 304 )
                        {
                            // Not Modified
                            OnSuccess.call( this );
                        }
                        else
                        {
                            OnError.call( this, 'Response status = ' + responseStatus );
                        }
                    }
                    
                    OnComplete.call( this );
                }
            };
            
            function OnError( error )
            {
                events.trigger( this.events, 'error',
                {
                    error: error
                });
            };
            
            function OnSuccess()
            {
                events.trigger( this.events, 'success' );
            };
            
            function OnAbort()
            {
                events.trigger( this.events, 'abort' );
            };
            
            function OnComplete()
            {
                events.trigger( this.events, 'complete' );
            };
        }
    });
    
    Object.defineProperties( Request,
    {
        State:
        {
            value: State
        },
        
        ResponseType:
        {
            value: ResponseType
        }
    });
    
    Object.defineProperty( api, 'requests',
    {
        value:
        {
            Request: Request,
            ResponseType: ResponseType,
            State: State
        }
    });

})( window );