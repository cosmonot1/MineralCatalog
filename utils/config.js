'use strict';

const objectpath = require( 'object-path' );
const deepmerge = require( 'deepmerge' );
const _ = require( 'lodash' );

let config = {};

const deepmerge_opts = { arrayMerge: ( dst, src, opts ) => src };

module.exports = getModule;
module.exports.current = current;
module.exports.load = load;

function getModule( ns ) {

  const fn = __filename;

  if ( require.cache[ require.resolve( fn ) + ns ] ) {
    return require.cache[ require.resolve( fn ) + ns ].exports;
  }

  delete require.cache[ require.resolve( fn ) ];
  const exports = require( fn );

  require.cache[ require.resolve( fn ) + ns ] = _.clone( require.cache[ require.resolve( fn ) ] );
  delete require.cache[ require.resolve( fn ) ];

  return exports;

}

function current() {
  return config;
}

/**
 * Order of precedence:
 * 1. runtime
 * 2. individual config env vars
 * 3. config env var
 * 4. file
 */
function load( config_file, config_runtime, namespace ) {

  // Remove all config properties first
  for ( const prop in config ) {
    if ( config.hasOwnProperty( prop ) ) {
      delete config[ prop ];
    }
  }

  let config_env_file = {};
  let config_env = {};

  // Handle config from environment variables
  if ( namespace ) {

    const env_var_prefix = formatNamespace( namespace ).replace( /-/g, '_' ) + '_config';

    const env_var_configfile = process.env[ env_var_prefix + 'file' ];

    console.log( env_var_prefix );
    console.log( env_var_prefix + 'file' );
    console.log( env_var_configfile );

    // Check if there is a config file
    if ( env_var_configfile ) {
      try {
        config_env_file = require( env_var_configfile );
      }
      catch ( err ) {
        console.error( err );
      }
    }

    console.log( JSON.stringify( config_env_file, null, 2 ) );

    // Get base64-encoded config string from environment variable
    config_env = process.env[ env_var_prefix ] || base64Encode( '{}' );

    // Attempt to parse base64-encoded config string into json
    try {
      config_env = JSON.parse( base64Decode( config_env, 'base64' ) );
    }
    catch ( err ) {
      throw new Error( 'Invalid base64-encoded JSON string provided through configuration environment variable.' );
    }

    // Get all env vars with env var prefix
    Object.keys( process.env ).forEach( function ( env_var_name ) {
      if ( env_var_name.indexOf( env_var_prefix + '_' ) === 0 ) {

        const path = env_var_name.substr( env_var_prefix.length + 1 ).replace( /_/g, '.' );
        const val = parseEnvVal( process.env[ env_var_name ] );

        objectpath.set( config_env, path, val );

      }
    } );

  }

  // Apply config from file
  config = deepmerge( config, config_file || {}, deepmerge_opts );

  // Apply config from environment config file variable
  config = deepmerge( config, config_env_file, deepmerge_opts );

  // Apply config from environment config variable
  config = deepmerge( config, config_env, deepmerge_opts );

  // Apply config object passed in
  config = deepmerge( config, config_runtime || {}, deepmerge_opts );

  return config;

}

function base64Encode( str ) {
  return Buffer.from( str, 'utf8' ).toString( 'base64' );
}

function base64Decode( str ) {
  return Buffer.from( str, 'base64' ).toString( 'utf8' );
}

function formatNamespace( namespace ) {
  namespace = namespace.split( '/' );
  namespace = namespace[ namespace.length - 1 ];
  return namespace.replace( /[^-._a-zA-Z0-9]+/, '' )
}

function parseEnvVal( v ) {
  try {
    return JSON.parse( v );
  }
  catch ( err ) {
    return v;
  }
}
