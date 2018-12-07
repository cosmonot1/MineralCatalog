'use strict';

const API = require( '../../api' );

module.exports = function () {

  const router = require( 'express' ).Router();

  router.route( '/authorize' ).post();

  router.route( '/specimen' )
    .get()
    .post();

  router.route( '/specimen/:_id' )
    .get()
    .delete()
    .patch();

  return router;

};