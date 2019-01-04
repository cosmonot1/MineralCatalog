'use strict';

const pkg = require( '../../package' );
const Config = require( '../../utils/config' )( pkg.name ).current;
const validate = require( '../../utils/validate' );
const jwt = require( 'jsonwebtoken' );
const Session = require( '../../models/v0/session' );

module.exports = {
  login,
  logout
};

function login( req, res, next ) {

  validate(
    req.body || {},
    {
      type: {
        $anyOf: [
          {
            grant_type: {
              value: 'password',
              default: 'password'
            },
            password: {
              type: String,
              required: true
            }
          }
        ]
      },
      required: true
    }
  ).then(
    data => authorize(
      data,
      ( err, result ) => err ? next( err ) : res.status( 200 ).json( result || {} ),
      req,
      res
    ),
    next
  );
}

function logout( req, res, next ) {

  // Note: Only accept token in cookie for GET requests to prevent CSRF attacks
  const auth = get( req.headers.authorization ) ||
    ( req.method === 'GET' ? get( 'Bearer ' + req.cookies.access_token ) : null ) ||
    get( 'Bearer ' + req.query.access_token );

  // TODO: Fix that auth.value is get to undefined if it doesn't exist
  if ( !auth || auth.type !== 'bearer' || !auth.value || auth.value === 'undefined' ) {
    // Clear access token cookie
    res.clearCookie( 'access_token', { secure: false } );
    res.clearCookie( 'access_token', { secure: true } );
    return res.status( 200 ).end();
  }

  const data = jwt.verify( auth.value, Config().session.secret );

  if ( !data.session ) {
    data.session = {};
  }

  Session.remove( data.session, ( err, result ) => err ? next( err ) : res.status( 200 ).json( result || {} ) );
}

function authorize( data, done, req, res ) {

  const secure = Boolean( Config().server.protocol === 'https' || Config().server.http.redirect );

  // Check password
  if ( !data.password || data.password !== Config().session.login ) {
    return done( {
      code: 401,
      reason: 'Invalid password',
      err: new Error( 'Invalid password' )
    } );
  }

  Session.add( {}, function ( err, result ) {

    if ( err ) {
      return done( err, null );
    }

    let session = {
      _id: result.session._id,
    };

    // Generate access token
    jwt.sign(
      { session: session },
      Config().session.secret,
      {
        expiresIn: Config().session.lifetime
      },
      function ( err, access_token ) {

        if ( err ) {
          return done(
            {
              code: 500,
              operation: 'console.authorize',
              err: err
            },
            null
          );
        }

        // Set cookies to be used for future authentication on success
        res.cookie(
          'access_token',
          access_token,
          {
            path: '/',
            secure: secure
          }
        );

        done( null, { access_token } );

      }
    );

  } );

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
