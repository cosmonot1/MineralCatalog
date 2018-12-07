'use strict';

const pkg = require( '../package' );

module.exports = {
  express: express
};

function express() {
  return ( req, res, next ) => {
    res.header( 'Server-Version', pkg.version );
    next();
  };
}
