'use strict';

const Utils = require( '../utils' );

module.exports = function ( logger ) {
  return function ( err, req, res, next ) {
    Utils.trace( function ( err ) {

      // Do not log 401/403
      if ( [ 401, 403 ].indexOf( err.code ) === -1 ) {
        // logger.error( err, !err.code || 500 <= err.code ); // Only post 500 errors to slack
      }

      //Handle API routes -> pass error object back to api caller
      // if ( req.originalUrl.match( /^(\/api\/v)([0-9]+)(\/)/ ) ) {
      return res.status( err.code || 500 ).json( { err: err } );
      // }

    } )( err );
  };
};
