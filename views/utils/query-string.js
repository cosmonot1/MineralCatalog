'use strict';

class QueryString {

  static encode( q ) {

    let qs = Object.keys( q ).reduce( ( qs, k ) => {

      if ( q[ k ] === undefined ) {
        return qs;
      }

      const key = encodeURIComponent( k );
      const val = encodeURIComponent( q[ k ] );

      return qs + `&${key}=${val}`;

    }, '' );

    if ( qs ) {
      qs = '?' + qs.slice( 1 );
    }

    return qs;

  }

  static decode( qs ) {

    // Remove leading `?`
    qs = qs.substring( 1 );

    const pl = /\+/g;
    const search = /([^&=]+)=?([^&]*)/g;
    const decode = s => decodeURIComponent( s.replace( pl, ' ' ) );

    let match;
    const q = {};

    while ( match = search.exec( qs ) ) {
      q[ decode( match[ 1 ] ) ] = decode( match[ 2 ] );
    }

    return q;

  }

}
