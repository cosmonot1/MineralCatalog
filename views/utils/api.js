'use strict';

window.API = ( function API() {

  // Detect browser support for CORS
  if ( !( 'withCredentials' in new XMLHttpRequest() ) && typeof XDomainRequest === 'undefined' ) {
    throw new Error( 'CORS not supported by browser.' );
  }

  const that = Object.create( API.prototype );

  that.version = '0.0.1';

  const isRelativeUrl = url => {
    try {
      new URL( url );
    }
    catch ( err ) {
      return true;
    }
  };

  const ajax = ( method, url, data, done ) => {

    const cookie = window.getCookie( 'access_token' );

    if ( method.toUpperCase() === 'GET' ) {
      url += QueryString.encode( window.flatten( data || {} ) );
    }

    const xhr = new XMLHttpRequest();

    xhr.open( method, url, true );
    xhr.responseType = 'json';

    if ( isRelativeUrl( url ) ) {
      xhr.setRequestHeader( 'Content-Type', 'application/json;charset=UTF-8' );
      xhr.setRequestHeader( 'Authorization', 'Bearer ' + cookie );
    }

    xhr.onload = () => {

      if ( !xhr.response ) {
        return done( new Error( 'Received invalid response from server.' ), null );
      }

      if ( !( xhr.response.err && ( xhr.response.err.code === 401 ) && cookie ) ) {
        return done( xhr.response.err || null, xhr.response.err ? null : xhr.response );
      }

      alert( 'Authentication session token expired. Please refresh the page and log in again.' );

      const query = {
        redirect: window.location.href
      };

    };

    if ( method.toUpperCase() === 'GET' ) {
      return xhr.send();
    }

    xhr.send( JSON.stringify( data || {} ) );

  };

  that.user = {

    authorize: ( data, done ) =>
      ajax( 'POST', '/api/v0/authorize', data, done ),

    logout: ( data, done ) =>
      ajax( 'POST', '/api/v0/user/logout', data, done ),

  };

  that.specimen = {

    add: ( data, done ) =>
      ajax( 'POST', '/api/v0/specimen', data, done ),

    get: ( data, done ) =>
      ajax( 'GET', `/api/v0/specimen/${data.specimen._id}`, data, done ),

    list: ( data, done ) =>
      ajax( 'POST', '/api/v0/specimen/list', data, done ),

    upload: ( data, done ) =>
      ajax( 'GET', `/api/v0/specimen/upload/${data.type}`, data, done ),

    remove: ( data, done ) =>
      ajax( 'DELETE', '/api/v0/specimen', data, done ),

    update: ( data, done ) =>
      ajax( 'PATCH', `/api/v0/specimen/${data.specimen._id}`, data, done )

  };

  return that;

} )();
