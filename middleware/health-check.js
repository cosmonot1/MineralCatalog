'use strict';

module.exports = ( req, res, next ) => {

  if ( req.get( 'user-agent' ) === 'GoogleHC/1.0' ) {
    return res.status( 200 ).end();
  }

  next();

};
