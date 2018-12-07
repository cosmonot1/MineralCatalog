'use strict';

const Specimen = require( '../../models/v0/specimen' );

module.exports = {};

function fmtReqRes( fn ) {
  return async req => {



    return await fn( req.body );

  };
}
