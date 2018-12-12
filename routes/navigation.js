'use strict';

const path = require( 'path' );

const index_html_dir = path.resolve( __dirname, '..', 'views' );

const routes = [
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
