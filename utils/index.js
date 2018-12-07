'use strict';

const fs = require( 'fs' );
const path = require( 'path' );
const objectpath = require( 'object-path' );

module.exports = {
  array,
  capitalize,
  clone,
  inArray,
  getFiles,
  noop() {return 0},
  replaceCharInObjectKeys,
  isFunction: isFunction,
  regexEscape,
  arrayMergePreserveSource,
  round,
  unflatten,
  weightedAvg
};

function array( v ) {
  return v === undefined ? [] : Array.isArray( v ) ? v : [ v ];
}

function capitalize( a ) {
  return a.charAt( 0 ).toUpperCase() + a.slice( 1 );
}

function clone( a ) {
  return JSON.parse( JSON.stringify( a ) );
}

function inArray( v ) {

  v = array( v );

  if ( v ) {
    return { $in: v };
  }

}

function getFiles( paths, files, ignore_folders, extensions ) {

  if ( !Array.isArray( paths ) ) {
    paths = [ paths ];
  }

  extensions = extensions || [];
  ignore_folders = ignore_folders || [];
  files = files || [];
  var folders = [];

  paths.forEach( function ( p ) {

    fs.readdirSync( p ).forEach( function ( fn ) {

      fn = path.resolve( p, fn );

      var stat = fs.statSync( fn );

      if ( stat.isDirectory() ) {
        if ( ignore_folders.indexOf( path.basename( fn ) ) === -1 ) {
          folders.push( fn );
        }
      }
      else if ( stat.isFile() ) {
        if ( extensions.indexOf( path.extname( fn ) ) !== -1 ) {
          files.push( fn );
        }
      }

    } );

  } );

  if ( folders.length ) {
    getFiles( folders, files, ignore_folders, extensions );
  }

  return files;

}

function replaceCharInObjectKeys( data, a, b ) {

  // Check if we have keys that could be replaced
  if ( !data || typeof data !== 'object' || typeof a !== 'string' || typeof b !== 'string' ) {
    return data;
  }

  var _data = {};

  // Loop through all the keys
  Object.keys( data ).forEach( function ( k ) {

    // Replace 'a' with 'b'
    var _k = k.replace( new RegExp( regexEscape( a ), 'g' ), b );

    // Recurse and associate
    _data[ _k ] = replaceCharInObjectKeys( data[ k ], a, b );

  } );

  return _data;

}

function isFunction( functionToCheck ) {
  return functionToCheck && {}.toString.call( functionToCheck ) === '[object Function]';
}

function regexEscape( str ) {
  // the two opening square brackets might be redundant, might want to replace second one with \[
  return str.replace( /[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&' );
}

function arrayMergePreserveSource( dest, source, options ) {
  return source;
}

function round( n, z = 100 ) {

  if ( typeof n === 'number' ) {
    return Math.round( n * z ) / z;
  }

  if ( Array.isArray( n ) ) {
    return n.map( n => n !== n ? 0 : round( n, z ) );
  }

  if ( typeof n === 'object' ) {

    const obj = Object.assign( {}, n );

    for ( const [ k, v ] of Object.entries( obj ) ) {
      obj[ k ] = round( v, z );
    }

    return obj;

  }

  return n;

}

function unflatten( flat ) {

  const obj = {};

  for ( const [ k, v ] of Object.entries( flat ) ) {
    objectpath.set( obj, k, v );
  }

  return obj;

}

function weightedAvg( a ) {
  const sum = a.reduce( ( [ vs, ws ], [ v, w ] ) => [ vs + v * w, ws + w ], [ 0, 0 ] );
  return sum[ 0 ] / sum[ 1 ];
}
