'use strict';

const pkg = require( '../package' );
const Config = require( '@simple-emotion/config' )( pkg.name ).current;
const Session = require( '../models/session' );
const jwt = require( 'jsonwebtoken' );

module.exports = {
  express: express
};

function express() {
  return function ( req, res, next ) {

    req.ip_address = proxy( req.header( 'via' ), req.header( 'x-forwarded-for' ) ) || req.connection.remoteAddress;

    // We require that the cookie-parser middleware is registered before this middleware
    if ( !req.cookies ) {
      return next(
        {
          code: 500,
          type: 'configuration',
          err: new Error( 'Missing middleware: cookie-parser.' )
        }
      );
    }

    handle( req, res, next );

  };
}

function handle( req, res, next ) {

  delete req.session;

  // Note: Only accept token in cookie for GET requests to prevent CSRF attacks
  const auth = get( req.headers.authorization ) ||
               ( req.method === 'GET' ? get( 'Bearer ' + req.cookies.access_token ) : null ) ||
               get( 'Bearer ' + req.query.access_token );

  // TODO: Fix that auth.value is get to undefined if it doesn't exist
  if ( !auth || auth.type !== 'bearer' || !auth.value || auth.value === 'undefined' ) {
    res.clearCookie( 'access_token', { secure: false } );
    res.clearCookie( 'access_token', { secure: true } );
    return next();
  }

  // Ensure valid jwt
  jwt.verify( auth.value, Config().session.secret, function ( err, token ) {

    if ( err ) {
      res.clearCookie( 'access_token', { secure: false } );
      res.clearCookie( 'access_token', { secure: true } );
      return next(
        {
          code: 401,
          domain: 'user',
          operation: 'session.jwt.validate',
          type: 'authentication',
          reason: err,
          err: new Error( 'Invalid token.' )
        }
      );
    }

    // Ensure valid session
    Session.get( token.session, function ( err, result ) {

      if ( err ) {
        res.clearCookie( 'access_token', { secure: false } );
        res.clearCookie( 'access_token', { secure: true } );
        return next(
          {
            code: 401,
            domain: 'user',
            operation: 'session.get',
            type: 'authentication',
            reason: err,
            err: new Error( 'Invalid session.' )
          }
        );
      }

      req.session = result.session;

      next();

    } );

  } );

}

function proxy( via, xff ) {
  if ( via === '1.1 google' ) {
    return ( xff || '' ).split( ',' )[ 0 ];
  }
}

function get( authorization ) {

  const parts = ( authorization || '' ).split( ' ' );

  if ( parts[ 0 ] && parts[ 1 ] ) {
    return {
      type: parts[ 0 ].toLowerCase() || '',
      value: parts[ 1 ] || ''
    };
  }

}
