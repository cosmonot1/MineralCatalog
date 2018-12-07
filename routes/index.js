'use strict';

const pkg = require( '../package' );
const _version = pkg.version.split( '.' );

const VERSION = {
  full: pkg.version,
  major: _version[ 0 ],
  minor: _version[ 1 ],
  patch: _version[ 2 ]
};

module.exports = function () {

  const router = require( 'express' ).Router();

  // Import all api versions
  for ( let i = 0; i <= VERSION.major; ++i ) {
    try {
      router.use( '/api/v' + i, require( './v' + i )() );
    }
    catch ( err ) {
    }
  }

  // Default to current version for unversioned api routes
  router.use( '/api', require( './v' + VERSION.major )() );
  router.use( '/', require( './navigation' )() );

  // Other handlers
  router.route( '*' ).all( otherwise );

  function otherwise( req, res ) {
    console.log( 'Received unknown request: ' + req.originalUrl );

    res.status( 404 ).json( {
      code: 404,
      err: 'Received unknown request: ' + req.originalUrl
    } );
  }

  return router;

};
