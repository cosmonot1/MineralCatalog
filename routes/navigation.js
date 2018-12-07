'use strict';

const path = require( 'path' );

// TODO: figure out where the HTML files will go
const index_html_dir = path.resolve( __dirname, '..', 'views' );

// TODO: Figure out views and build navigation routes from those

const routes = [
  '/terms-of-service',
  '/error',
  '/unauthorized',
  '/login',
  '/welcome',
  '/:view(|home)',
];

module.exports = function () {

  const router = require( 'express' ).Router();

  routes.forEach( route => router.route( route ).get( index ) );

  function index( req, res ) {
    return res.sendFile( 'index.html', { root: index_html_dir } );
  }

  return router;

};
