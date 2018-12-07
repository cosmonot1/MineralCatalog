'use strict';

module.exports = {
  allow: allow,
  disallow: disallow
};

function allow( req, res, next ) {
  res.header( 'Cache-Control', 'public, max-age=86400' );
  next();
}

function disallow( req, res, next ) {
  res.header( 'Cache-Control', 'no-store' );
  next();
}
