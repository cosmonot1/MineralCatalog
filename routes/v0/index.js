'use strict';

const API = require( '../../api' );

module.exports = function () {

  const router = require( 'express' ).Router();

  router.route( '/authorize' ).post( API.v0.user.login );
  router.route( '/user/logout' ).post( API.v0.user.logout );

  router.route( '/specimen' )
    .get( API.v0.specimen.list )
    .post( API.v0.specimen.add );

  router.route( '/specimen/:_id' )
    .get( API.v0.specimen.get )
    .delete( API.v0.specimen.remove )
    .patch( API.v0.specimen.update );

  router.route( '/specimen/download/:type' )
    .get( API.v0.specimen.download );

  return router;

};