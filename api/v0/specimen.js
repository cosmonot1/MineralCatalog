'use strict';

const Specimen = require( '../../models/v0/specimen' );

module.exports = {
  add(){},
  get(){},
  list(){},
  remove(){},
  update(){},

};

function fmtReqRes( fn ) {
  return async req => {



    return await fn( req.body );

  };
}
