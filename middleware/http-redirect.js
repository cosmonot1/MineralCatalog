'use strict';

const http = require( 'http' );

module.exports = {
  express,
  server
};

function express( req, res, next ) {

  // Custom handler for health checks
  if ( req.url.startsWith( '/health-check' ) ) {
    res.writeHead( 200 );
    return res.end();
  }

  // Continue if front-end protocol is not http
  const forwarded_proto = req.get( 'x-forwarded-proto' );
  if ( !forwarded_proto || forwarded_proto === 'https' || forwarded_proto === 'wss' ) {
    return next();
  }

  res.set( 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload' );

  // Redirect to https since front-end protocol is http
  res.writeHead( 301, { 'Location': 'https://' + req.headers.host + req.url } );
  res.end();

}

function server( port, done ) {

  done = done || ( () => 0 );

  http.createServer( function ( req, res ) {

    // Custom handler for health checks
    if ( req.url.startsWith( '/health-check' ) ) {
      res.writeHead( 200 );
      return res.end();
    }

    // Redirect to https
    res.writeHead( 301, { 'Location': 'https://' + req.headers.host + req.url } );
    res.end();

  } ).listen( port, function () {
    console.log( '[!] HTTP redirect server listening on port %s.', port );
    done();
  } );

}
