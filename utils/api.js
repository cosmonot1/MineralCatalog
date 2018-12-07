'use strict';

const pkg = require( '../package' );
const Config = require( './config' )( pkg.name ).current;
const Utils = require( './index' );

const p = LocalUtils2.promisify;

module.exports = {
  authed,
  callbackify,
  formatBody,
};

function callbackify( fn ) {
  return ( req, res, next ) => fn( req, res ).then( r => res.status( 200 ).json( r || {} ) ).catch( next );
}

function formatBody( fn ) {
  return ( req, res ) => {

    req.body = Object.assign( {}, req.body );
    req.query = Object.assign( {}, req.query );

    req.query = Utils.unflatten( req.query );

    if ( req.method.toUpperCase() === 'GET' ) {
      req.body = req.query;
      req.query = {};
    }

    Object.assign( req.body, req.query, req.params );

    return fn( req, res );

  };
}
